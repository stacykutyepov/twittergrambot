const { getSubscriptions } = require('../subscriptions/helpers');

function Phonograph(bot) {
    return function broadcast(text) {
        getSubscriptions().forEach((sub) => {
            bot.sendMessage(sub, text);
        })
    }
}

module.exports = Phonograph;
