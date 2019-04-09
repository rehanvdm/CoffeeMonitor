const aws = require('aws-sdk');
aws.config.region = 'us-east-1';

const uuidv4 = require('uuid/v4');
const moment = require('moment');
const _ = require('lodash');

/* Only if running tests locally */
if(!process.env.ENVIRONMENT)
{
    process.env.ENVIRONMENT = "prod";
    process.env.TEMP_MIN = 40;
    process.env.TEMP_MAX = 50;
    process.env.SNS_TOPIC_TELEGRAM = "XXXX";
}

let dynamoClient = new aws.DynamoDB({apiVersion: '2012-08-10'});
let snsClient = new aws.SNS({apiVersion: '2010-03-31'});

const DynmaoDB_Events = require('./DynamoDB/Events');
const DynmaoDB_State = require('./DynamoDB/State');

let db_event = new DynmaoDB_Events(dynamoClient, process.env.ENVIRONMENT);
let db_State = new DynmaoDB_State(dynamoClient, process.env.ENVIRONMENT);



module.exports.handler = async (event, context) =>
{
    let response = null;
    try
    {
        let dtNow = moment().toISOString();
        switch (event.event_type)
        {
            case "button_click":
                console.log("BUTTON 0 was pressed", event.click_no);

                let expiration_ts_30_days = (Math.round(Date.now() / 1000) + (60 * 60 * 24 * 30));
                await db_event.Insert(DynmaoDB_Events.EVENTS.BUTTON_CLICK, dtNow, event.click_no, expiration_ts_30_days);
                await SendSNSNotification("Button Clicked: " +  event.click_no);
                break;

            case "temp":
                console.log("TEMP is", event.value);

                await TempChange(event, dtNow);
                break;

            default:
                console.log(event);
                break;
        }
        response = true;
    }
    catch (err)
    {
        console.error(err);
        response = false;
    }
    finally
    {
        //console.log("* Response: " + response)
        return response;
    }
};


async function SendSNSNotification(message)
{
    let params = {
        Subject: "SendNotification",
        Message: JSON.stringify({"message": message}),
        TopicArn:  process.env.SNS_TOPIC_TELEGRAM
    };
    return snsClient.publish(params).promise();
}

async function TempChange(event, dtNow)
{
    let minTemp = process.env.TEMP_MIN;
    let maxTemp = process.env.TEMP_MAX;
    let temp = event.value;

    let expiration_ts_30_days = (Math.round(Date.now() / 1000) + (60 * 60 * 24 * 30));

    /* PARALLEL: Get Current State, Last Temperature and save Current Temperature */
    let [pState, pLastTemp, pSaveTemp] = [db_State.GetCurrentState(),
                                            db_event.GetLastTempValue(),
                                            db_event.Insert(DynmaoDB_Events.EVENTS.TEMP, dtNow, temp, expiration_ts_30_days)];
    let currentState = await pState;
    let prevTemp = await pLastTemp;
    await pSaveTemp;

    /* If no prev state, then means clean table, just insert a No Coffee state so that checking logic not fail */
    if(!currentState)
        await db_State.Insert(DynmaoDB_State.STATES.NO_COFFEE, dtNow, temp, expiration_ts_30_days);

    /* If no prev temp then return, need at least one value to make decision */
    if(!prevTemp)
        return;

    let tempDifFromPrev = (temp - prevTemp.Value);


    /* First state is special, it looks at the Prev value and then starts the StateMachine */
    if( tempDifFromPrev > 5
        && (currentState.StateValue === DynmaoDB_State.STATES.NO_COFFEE || currentState.StateValue === DynmaoDB_State.STATES.GETTING_COLD))
    {
        /* NEW COFFEE */
        console.log("** NEW COFFEE");
        let pNotify = SendSNSNotification("Coffee: ☕ NEW, temp: " + temp + " °C");
        let pNewState = db_State.Insert(DynmaoDB_State.STATES.NEW_COFFEE, dtNow, temp, expiration_ts_30_days);

        await pNotify;
        await pNewState;
    }
    else if( (tempDifFromPrev < 0)  /* Only if getting colder then check this */
        && temp > minTemp && temp <= maxTemp
        && currentState.StateValue === DynmaoDB_State.STATES.NEW_COFFEE)
    {
        /* DRINK IT NOW, GOOD COFFEE */
        console.log("** DRINK IT NOW, GOOD COFFEE");
        let pNotify = SendSNSNotification("Coffee: 👍 GOOD, temp: " + temp + " °C");
        let pNewState = db_State.Insert(DynmaoDB_State.STATES.GOOD_TEMP, dtNow, temp, expiration_ts_30_days);

        await pNotify;
        await pNewState;
    }
    else if(temp <= minTemp
        && currentState.StateValue === DynmaoDB_State.STATES.GOOD_TEMP)
    {
        /* GETTING COLD FAST, DRINK */
        console.log("** GETTING COLD FAST, DRINK");
        let pNotify = SendSNSNotification("Coffee: 👎 COLD, temp: " + temp + " °C");
        let pNewState = db_State.Insert(DynmaoDB_State.STATES.GETTING_COLD, dtNow, temp, expiration_ts_30_days);

        await pNotify;
        await pNewState;
    }
}
