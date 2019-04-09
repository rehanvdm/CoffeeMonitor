
const BaseClass = require('./BaseClass');

class Events extends BaseClass
{
    constructor(dynamoClient,env)
    {
        super();
        this.TableName = "coffee-monitor-"+env;
        this.DynamoClient = dynamoClient;
        this.PK_PreFix = "Event_";
        this.SK_CurrentState = this.GetDynamoValue("__Current");
    }


    async Insert(eventType, dateTime, value, expiration_ts = null)
    {
        var params = {
            TableName: this.TableName,
            Item: {
                    'PK' : this.GetDynamoValue(this.PK_PreFix+eventType),
                    'SK' : this.GetDynamoValue(dateTime),
                    'Value' : this.GetDynamoValue(value),
                  }
        };

        if(expiration_ts)
            params.Item["expiration_ts"] = this.GetDynamoValue(expiration_ts);

        await this.DynamoClient.putItem(params).promise();

        /* ============= For most recent temp event ============= */
        if(eventType === Events.EVENTS.TEMP)
        {
            params = {
                TableName: this.TableName,
                Item: {
                    'PK' : this.GetDynamoValue(this.PK_PreFix+Events.EVENTS.TEMP),
                    'SK' : this.SK_CurrentState, /* If SK is going to be unique then it will insert every time, we want to only use 1 record, updating the same every time */
                    'Value' : this.GetDynamoValue(value)
                }
            };
            return await this.DynamoClient.putItem(params).promise();
        }
        /* ================================================ */
    };

    async GetLastTempValue()
    {
        let params = {
            TableName: this.TableName,
            Key: {
                'PK': this.GetDynamoValue(this.PK_PreFix+Events.EVENTS.TEMP),
                "SK": this.SK_CurrentState,
            }
        };

        let item = (await this.DynamoClient.getItem(params).promise()).Item;
        return this.FromDynamoValue(item);
    };
}


Events.EVENTS = { "BUTTON_CLICK": "Button_Click", "TEMP": "Temp", "CURRENT_STATE_CHANGE": "CurrentStateChange" };

module.exports = Events;