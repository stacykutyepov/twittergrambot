// temporary fix to suppress warning from node-telegram-bot-api
// about auto enabling promise cancellation. This can be removed
// once node-telegram-bot-api@1.0.0 is released.
// details: https://github.com/yagop/node-telegram-bot-api/issues/319
process.env.NTBA_FIX_319 = true;

const TelegramBot = require('node-telegram-bot-api');
const logger = require('../utils/logger')(__filename);
const Subscriptions = require('./subscriptions');
const Phonograph = require('./phonograph');
const bot = new TelegramBot(process.env.tg_token, {polling: true});

Subscriptions(bot);

logger.info('Initialized telegram bot');

module.exports = { broadcast: Phonograph(bot) };




