var Context = function () { };
Context.prototype.succeed = function (response ) {  process.exit(); }; // So that if called, actually ends the function
Context.prototype.getRemainingTimeInMillis = function ()  {  return 30*1000; }; // Returns the same every time
var context = new Context();


var event = { "event_type": "button_click", "click_no": 1234};

var lambda = require("../coffee-monitor/app");


async function RunTest()
{
    let ret = await lambda.handler(event ,context);
    console.log(ret);
    process.exit();
}

RunTest();