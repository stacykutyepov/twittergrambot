const TelegramBot = require('node-telegram-bot-api');
const Subscriptions = require('./subscriptions');
const Phonograph = require('./phonograph');
const bot = new TelegramBot(process.env.tg_token, {polling: true});

Subscriptions(bot);

module.exports = { broadcast: Phonograph(bot) };




