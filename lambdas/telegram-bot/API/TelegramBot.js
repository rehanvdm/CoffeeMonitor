const _ = require('lodash');
const axios = require('axios');

class TelegramBot
{
    constructor(botToken)
    {
        this.BotToken = botToken;
    }

    async Send(text, chatId)
    {
        var msg = encodeURI(text);
        let url = "https://api.telegram.org/bot"+this.BotToken+"/";
            url += "sendMessage?text="+msg;

        if(chatId)
            url += "&chat_id=" + chatId;

        let options = {
            method: 'get',
            url: url,
            timeout: 10000,
            headers: { }
        };

        let res = await axios(options);
        return {
            'status': res.status,
            'data': res.data
        };
    }
}

module.exports = TelegramBot;