load('api_aws.js');

load('api_config.js');
load('api_dash.js');
load('api_events.js');

load('api_gpio.js');
load('api_adc.js');

load('api_mqtt.js');
load('api_shadow.js');
load('api_timer.js');
load('api_sys.js');


let btn = Cfg.get('board.btn1.pin');              // Built-in button GPIO
let ledPin = 5;                                      // Built-in LED GPIO number
let tempPin = 36;                                 //Pin to which the Temperature sensor is connected
let onhi = Cfg.get('board.led1.active_high');     // The value of the LED on when high
let shadowState = {led: false, btnCount: 0, uptime: 0};  // Device state
let online = false;                               // Connected to the cloud

/* For MQTT Topics */
let application = "coffee-monitor";
let location = "home";


/**
 * Changes the LED on or off
 * @param {boolean} on
 * @constructor
 */
let SetLED = function(on)
{
    let level = onhi ? on : !on;
    GPIO.write(ledPin, level);
    print('LED on ->', ledPin, on);
};

/**
 * Sends the Device Shadow to AWS IoT
 * @constructor
 */
let ReportState = function()
{
    Shadow.update(0, shadowState);
};

/**
 *
 * @param topic
 * @param objMessage
 * @constructor
 */
let PublishEvent = function (topic, objMessage)
{
    let message = JSON.stringify(objMessage);
    let newTopic = application + "/" + location + "/" + topic;
    if (AWS.isConnected() || (MQTT.isConnected()))
    {
        print('== Publishing to ' + newTopic + ':', message);
        MQTT.pub(newTopic, message, 0 /* QoS */);
    }
    else
        print('== Not connected!');
};



let SmaArrayValue = function(arr)
{
    let summm = 0;
    let counttt = arr.length;
    for(let i = 0; i < counttt; i++)
        summm += arr[i];

    return summm/counttt;
};

/* We cn not define an array dynamically, the compiler needs to know how much space to reserve for these arrays
 * These arrays store the values for the SMA (Simple Moving Average) calculation */
let lastMinuteReadings_ArrayIndex = 0;
let lastMinuteReadings = [0,0,0,0,0,0,0,0,0,0];
let lastThreeMinutesTemps_ArrayIndex = 0;
let lastThreeMinutesTemps = [0,0,0];

/**
 * Every 5 seconds, it reads the temperature and saves it in the SMA (Simple Moving Average) array which is used later
 * to smooth the temperature value as this sensor is not too accurate and it is normal to see upto 1 degrees change 
 * every now and then between readings. 
 * 
 * This also flashes our LED every 5 seconds if it has internet connection and is connected to the AWS Cloud
 */
Timer.set(5000, Timer.REPEAT, function()
{
    print('TIMER 5 secs');
    
    let adcVal = ADC.read(tempPin);

    /* Should be ((adcVal / 4095.0) * 3300)/10
    * But that is wrong the value 4095 (2^12) is too high, so let's solving this provided new value
    * Actual Meassure ADC Code Value = 235        Actual milli volt measured = 332
      * So solving X
      * (235/X) * 3300 = 332
      * X = 2335
      * */
    let tempVal = ((adcVal / 2335.0) * 3300)/10;
    print('ADC VALUE: ' , adcVal, tempVal);

    /* Saving values in the SMA window */
    lastMinuteReadings[lastMinuteReadings_ArrayIndex++] = tempVal;
    if(lastMinuteReadings_ArrayIndex >= 10)
        lastMinuteReadings_ArrayIndex = 0;


    /* Flash led at 5 seconds if online, else off */
    if(online)
    {
        shadowState.led = !shadowState.led;
        SetLED(shadowState.led);
    }
    else
    {
        SetLED(false);
    }
    
}, null);



Timer.set(60000, Timer.REPEAT, function()
{
    print('TIMER 60 secs');

    let currentTemp = SmaArrayValue(lastMinuteReadings);

    /* If completley empty, only happens at startup, then fill array with the first value */
    if(lastThreeMinutesTemps[0] === 0)
    {
        for(let i = 0; i < 3; i++)
            lastThreeMinutesTemps[i] = currentTemp;
    }

    /* Saving the last send values in window */
    lastThreeMinutesTemps[lastThreeMinutesTemps_ArrayIndex++] = currentTemp;
    if(lastThreeMinutesTemps_ArrayIndex >= 3)
        lastThreeMinutesTemps_ArrayIndex = 0;

    let currentSMATemp =  SmaArrayValue(lastThreeMinutesTemps);

    print('Current Temp' , currentTemp);
    print('Current SMA Temp' , currentSMATemp);

    PublishEvent("temp", { "event_type": "temp", "value": currentSMATemp });
}, null);


/**
 * Set up for Shadow handler to synchronise device state with the shadow state
 * NOT USED
  */
Shadow.addHandler(function(event, obj)
{
    if (event === 'UPDATE_DELTA')
    {
        print('GOT DELTA:', JSON.stringify(obj));
        ReportState();  // Report our new state, hopefully clearing delta
    }
});

/**
 * If the button is pressed, then send a MQTT Message. The code below is just to Debounce the button.
 */
if (btn >= 0)
{
    let btnCount = 0;
    let btnPull, btnEdge;
    if (Cfg.get('board.btn1.pull_up') ? GPIO.PULL_UP : GPIO.PULL_DOWN)
    {
        btnPull = GPIO.PULL_UP;
        btnEdge = GPIO.INT_EDGE_NEG;
    }
    else
    {
        btnPull = GPIO.PULL_DOWN;
        btnEdge = GPIO.INT_EDGE_POS;
    }

    GPIO.set_button_handler(btn, btnPull, btnEdge, 20, function()
    {
        shadowState.btnCount++;
        PublishEvent("button_click", { "event_type": "button_click", "click_no": shadowState.btnCount });
    }, null);
}

Event.on(Event.CLOUD_CONNECTED, function() {
    online = true;
    Shadow.update(0, {ram_total: Sys.total_ram()});
}, null);

Event.on(Event.CLOUD_DISCONNECTED, function() {
    online = false;
}, null);



// ================================================== SETUP ================================================ //

GPIO.set_mode(ledPin, GPIO.MODE_OUTPUT);
ADC.enable(tempPin);

SetLED(shadowState.led);