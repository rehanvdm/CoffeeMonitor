var Context = function () { };
Context.prototype.succeed = function (response ) {  process.exit(); }; // So that if called, actually ends the function
Context.prototype.getRemainingTimeInMillis = function ()  {  return 30*1000; }; // Returns the same every time
var context = new Context();

const Events = require('./events/events.js');
var events = new Events();

var event = events.SNS_MESSAGE('SendNotification', {message: "Test"});
var lambda = require("../telegram-bot/app");

async function RunTest()
{
    let ret = await lambda.handler(event ,context);
    console.log(ret);
    process.exit();
}

RunTest();

