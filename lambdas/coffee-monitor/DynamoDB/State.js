
const BaseClass = require('./BaseClass');

class State extends BaseClass
{
    constructor(dynamoClient,env)
    {
        super();
        this.TableName = "coffee-monitor-"+env;
        this.DynamoClient = dynamoClient;
        this.PK = this.GetDynamoValue("State");
        this.SK_CurrentState = this.GetDynamoValue("__Current");
    }


    async Insert(stateName, dateTime, temp, expiration_ts)
    {
        /* ============== For List of states ============== */
        var params = {
            TableName: this.TableName,
            Item: {
                    'PK' : this.PK,
                    'SK' : this.GetDynamoValue(dateTime),
                    'StateValue' : this.GetDynamoValue(stateName),
                    'Temp' : this.GetDynamoValue(temp),
                  }
        };

        if(expiration_ts)
            params.Item["expiration_ts"] = this.GetDynamoValue(expiration_ts);

        await this.DynamoClient.putItem(params).promise();
        /* ================================================ */

        /* ============= For most recent state ============= */
        params = {
            TableName: this.TableName,
            Item: {
                'PK' : this.PK,
                'SK' : this.SK_CurrentState, /* If SK is going to be unique then it will insert every time, we want to only use 1 record, updating the same every time */
                'StateValue' : this.GetDynamoValue(stateName),
                'Temp' : this.GetDynamoValue(temp),
                'ChangedDT' : this.GetDynamoValue(dateTime)
            }
        };

        if(expiration_ts)
            params.Item["expiration_ts"] = this.GetDynamoValue(expiration_ts);

        return this.DynamoClient.putItem(params).promise();
        /* ================================================ */
    };

    async GetCurrentState()
    {
        let params = {
            TableName: this.TableName,
            Key: {
                'PK': this.PK,
                "SK": this.SK_CurrentState,
            }
        };

        let item = (await this.DynamoClient.getItem(params).promise()).Item;
        return this.FromDynamoValue(item);
    };
}


State.STATES = { "NEW_COFFEE": "NEW_COFFEE", "GOOD_TEMP": "GOOD_TEMP",  "GETTING_COLD": "GETTING_COLD", "NO_COFFEE": "NO_COFFEE"};

module.exports = State;