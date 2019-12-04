const tweets = require('./tweets');
const logger = require('../../utils/logger')(__filename);
const subscriptions = [{
    name: 'tweets',
    func: tweets,
}];

module.exports = (twitterClient) => {
    logger.info('Initialized twitter subscriptions module');

    return subscriptions.reduce((acc, value) => ({
        [value.name]: value.func(twitterClient)
    }), {});
};
