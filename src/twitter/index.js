const Twitter = require('twitter');
const Subscriptions = require('./subscriptions');
const logger = require('../utils/logger')(__filename);

const client = new Twitter({
    consumer_key: process.env.tw_consumer_key,
    consumer_secret: process.env.tw_consumer_secret,
    access_token_key: process.env.tw_access_token_key,
    access_token_secret: process.env.tw_access_token_secret,
});

const subscriptions = Subscriptions(client);

logger.info('Initialized twitter module');

module.exports = { subscriptions };
