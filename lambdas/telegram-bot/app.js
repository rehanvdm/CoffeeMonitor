const aws = require('aws-sdk');
aws.config.region = 'us-east-1';

const moment = require('moment');
const _ = require('lodash');


/* Only if running tests locally */
if(!process.env.ENVIRONMENT)
{
    process.env.TELEGRAM_BOT_TOKEN = "XXX";
    process.env.TELEGRAM_BOT_CHAT_ID = "XXX";
}

var TelegramBot = require('./API/TelegramBot');

module.exports.handler = async (event, context) =>
{
    console.log(JSON.stringify(event));
    let response = null;

    try
    {
        if(event.resource === '/{proxy+}' && event.path === '/bot_callback') /* If receiving HTTP Request from Telegram callback */
            response = await ReceiveNotification(event);
        else if(event.resource === '/{proxy+}')  /* If receiving Any other HTTP Requests, just reply with default 200 */
            response =  { statusCode: 200, body: 'Thank you' };
        else if(event.Records && event.Records[0].Sns && event.Records[0].Sns.Subject === "SendNotification" )  /* If came from SNS topic */
            response = await SendNotification(event.Records[0].Sns.Message);

        return response;
    }
    catch (err)
    {
        console.error(err);
        response = false;
    }
    finally
    {
        console.log("* Response: " + response)
        return response;
    }
};


async function ReceiveNotification(event)
{
    console.log(JSON.parse(event.body));

    let message = JSON.parse(event.body);

    let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    switch (message.message.text.toLowerCase())
    {
        case "chat id?":
            await bot.Send("Your chat id is: "+message.message.from.id, message.message.from.id);
            break;

        case "ping":
            await bot.Send("Pong", process.env.TELEGRAM_BOT_CHAT_ID); //message.message.from.id);
            break;

        default:
            await bot.Send("Sorry, I don't understand that", process.env.TELEGRAM_BOT_CHAT_ID); //message.message.from.id);
            break;
    }

    return {
        statusCode: 200,
        body: 'Thank you'
    };
}

async function SendNotification(event)
{
    let body = JSON.parse(event);
    let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    await bot.Send(body.message, process.env.TELEGRAM_BOT_CHAT_ID);
    return true;
}