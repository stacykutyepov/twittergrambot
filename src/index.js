const Twitter = require('./twitter');
const Telegram = require('./telegram');
const logger = require('./utils/logger')(__filename);

logger.info('Starting twittergram');

Twitter.subscriptions.tweets.onValue((v) => {
    Telegram.broadcast(v);
});
