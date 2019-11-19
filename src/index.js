const Twitter = require('./twitter');
const Telegram = require('./telegram');

Twitter.subscriptions.tweets.onValue((v) => {
    Telegram.broadcast(v);
});
