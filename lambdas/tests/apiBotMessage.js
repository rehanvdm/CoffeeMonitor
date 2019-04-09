var Context = function () { };
Context.prototype.succeed = function (response ) {  process.exit(); }; // So that if called, actually ends the function
Context.prototype.getRemainingTimeInMillis = function ()  {  return 30*1000; }; // Returns the same every time
var context = new Context();

const Events = require('./events/events.js');
var events = new Events();

var telegramMessage = {
    "update_id": 210731234,
    "message": {
        "message_id": 1234,
        "from": {
            "id": 637101234,
            "is_bot": false,
            "first_name": "Rehan",
            "last_name": "van der Merwe",
            "language_code": "en"
        },
        "chat": {
            "id": 637101234,
            "first_name": "Rehan",
            "last_name": "van der Merwe",
            "type": "private"
        },
        "date": 1554587470,
        "text": "Ping"
    }
};

var event = events.API_GATEWAY_HTTP_PROXY_POST('/bot_callback', telegramMessage);

var lambda = require("../telegram-bot/app");

async function RunTest()
{
    let ret = await lambda.handler(event ,context);
    console.log(ret);
    process.exit();
}

RunTest();

