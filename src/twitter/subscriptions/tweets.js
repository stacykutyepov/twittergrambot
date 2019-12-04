const Kefir = require('kefir');
const logger = require('../../utils/logger')(__filename);

const FOLLOWING = 25073877; //@realdonaldtrump

function Stream(twitterClient) {
    logger.info('Initialized subscription to stream of tweets');

    const streamOfTweets = twitterClient.stream('statuses/filter', {follow: FOLLOWING.toString()});

    return Kefir.stream((emitter) => {
        function onNewTweet(event) {
            if (event && event.text && event.user && event.user.id) {
                if (event.user.id === FOLLOWING) {
                    logger.info(`New tweet ${event.text} from "${event.user.name}" "${event.user.id}"`);

                    emitter.emit(event.text);
                }
            }
        }

        streamOfTweets.on('data', onNewTweet);

        streamOfTweets.on('error', (error) => {
            logger.error('Twitter API error', error);

            emitter.error(error);
        });

        return () => {
            logger.info('Destroyed subscription to stream of tweets');

            streamOfTweets.off('data', onNewTweet);
        }
    });
}

module.exports = Stream;
