const logger = require('../../utils/logger')(__filename);
const { getSubscriptions } = require('../subscriptions/helpers');

function Phonograph(bot) {
    logger.info('Initialized phonograph of telegram\'s bot');
    return function broadcast(text) {
        getSubscriptions().forEach((sub) => {
            logger.info(`Sending "${text}" to: "${sub}"`);
            bot.sendMessage(sub, text);
        })
    }
}

module.exports = Phonograph;
