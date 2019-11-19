const { subscribe, unsubscribe } = require('./helpers.js');


function Subscriptions(bot) {
    bot.onText(/\/subscribe/, function onSubscribe(msg) {
        subscribe(msg.chat.id);
        bot.sendMessage(msg.chat.id, 'https://gph.is/2xCWlky');
    });

    bot.onText(/\/unsubscribe/, function onSubscribe(msg) {
        unsubscribe(msg.chat.id);
        bot.sendMessage(msg.chat.id, 'https://gph.is/2RTC68i');
    });
}


module.exports = Subscriptions;
