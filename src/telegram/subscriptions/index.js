const logger = require('../../utils/logger')(__filename);
const { subscribe, unsubscribe } = require('./helpers.js');


function Subscriptions(bot) {
    logger.info('Initialized subscriptions modules of telegram bot');

    bot.onText(/\/subscribe/, function onSubscribe(msg) {
        logger.info(`Subscribe request from ${msg.chat.id}`, msg);
        subscribe(msg.chat.id);
        bot.sendMessage(msg.chat.id, 'https://gph.is/2xCWlky');
    });

    bot.onText(/\/unsubscribe/, function onSubscribe(msg) {
        logger.info(`Unsubscribe request from ${msg.chat.id}`, msg);
        unsubscribe(msg.chat.id);
        bot.sendMessage(msg.chat.id, 'https://gph.is/2RTC68i');
    });
}


module.exports = Subscriptions;
