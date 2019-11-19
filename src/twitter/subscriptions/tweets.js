const Kefir = require('kefir');

const FOLLOWING = 25073877; //@realdonaldtrump

function Stream(twitterClient) {
    const streamOfTweets = twitterClient.stream('statuses/filter', {follow: FOLLOWING.toString()});

    return Kefir.stream((emitter) => {
        function onNewTweet(event) {
            if (event && event.text && event.user && event.user.id) {
                if (event.user.id === FOLLOWING) {
                    emitter.emit(event.text);
                }
            }
        }

        streamOfTweets.on('data', onNewTweet);

        return () => {
            streamOfTweets.off('data', onNewTweet);
        }
    });
}

module.exports = Stream;
