

var Context = function () { };
Context.prototype.succeed = function (response ) {  process.exit(); }; // So that if called, actually ends the function
Context.prototype.getRemainingTimeInMillis = function ()  {  return 30*1000; }; // Returns the same every time
var context = new Context();


var lambda = require("../coffee-monitor/app");

async function RunTest()
{
    let temps = [
                    20, 21, 22, 22,
                    24, 28, 34, 43, 59, 58, 55, 51, //Hot period, getting cooler
                    47, 46, 45, 41, 40,  //Good temp,
                    39, 35, 32 //Bad Temp
                 ];

    for(let i = 0; i < temps.length; i++)
    {
        let event = { "event_type": "temp", "value": temps[i]};
        let ret = await lambda.handler(event ,context);
    }

    console.log(ret);
    process.exit();
}


RunTest();