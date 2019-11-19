const tweets = require('./tweets');
const subscriptions = [{
    name: 'tweets',
    func: tweets,
}];

module.exports = (twitterClient) => {
    return subscriptions.reduce((acc, value) => ({
        [value.name]: value.func(twitterClient)
    }), {});
};
