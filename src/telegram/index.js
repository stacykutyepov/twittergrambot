const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger')(__filename);
const Subscriptions = require('./subscriptions');
const Phonograph = require('./phonograph');
const bot = new TelegramBot(process.env.tg_token, {polling: true});

Subscriptions(bot);

logger.info('Initialized telegram bot');

module.exports = { broadcast: Phonograph(bot) };




