
function isInt(n) { return n % 1 === 0; }

class BaseClass
{
    GetDynamoValue(value)
    {
        /* https://stackoverflow.com/questions/40855259/node-js-how-to-use-putitem-to-add-integer-to-list-w-dynamodb */
        let type = typeof value;

        if (type === "string")
            return { S: value };
        else if (type === "number")
            return { N: value.toString() };
        else if (type === "boolean")
            return { BOOL: value };
        else if (value.constructor === Array)
        {
            let array = value.map(function(element) { return this.GetDynamoValue(element); });
            return { L: array };
        }
        else if (type === "object" && value !== null)
        {
            let map = {};
            for (let key in value)
                map[key] = this.GetDynamoValue(value[key]);

            return { M: map };

        }
        else
            return null;
    }
    FromDynamoValue(value)
    {
        /* https://stackoverflow.com/questions/40855259/node-js-how-to-use-putitem-to-add-integer-to-list-w-dynamodb */
        if(!value)
            return null;

        if(value.S)
            return value.S;
        else if (value.N)
            return (isInt(value.N) ? parseInt(value.N) : parseFloat(value.N));
        else if (value.BOOL)
            return value.BOOL == true;
        // else if (typeof value === "array" || value.L)
        // {
        //     let array = value.map(function(element) { return this.FromDynamoValue(element); });
        //     return array;
        // }
        else if ((typeof value === "object" || value.M) || (typeof value === "array" || value.L) )
        {
            let map = {};
            for (let key in value)
                map[key] = this.FromDynamoValue(value[key]);

            return map;
        }
        else
            return null;
    }
}

module.exports = BaseClass;