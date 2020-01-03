const Kefir = require('kefir');
const logger = require('../../utils/logger')(__filename);

const FOLLOWING = 25073877; //@realdonaldtrump
const RECONNECT_TIMEOUT = 5000;

class StreamOfTweets {
    constructor(emitter, twitterClient) {
        this.emitter = emitter;
        this.twitterClient = twitterClient;

        this.streamOfTweets = null;
        this.create = this.create.bind(this);
        this.onError = this.onError.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onNewTweet = this.onNewTweet.bind(this);
    }

    create() {
        logger.info('Initialized subscription to stream of tweets');

        this.streamOfTweets = this.twitterClient.stream('statuses/filter', {follow: FOLLOWING.toString()});
        this.streamOfTweets.on('data', this.onNewTweet);
        this.streamOfTweets.on('error', this.onError);
        this.streamOfTweets.on('end', this.onEnd);
    }

    onNewTweet(event) {
        if (event && event.text && event.user && event.user.id) {
            if (event.user.id === FOLLOWING) {
                logger.info(`New tweet ${event.text} from "${event.user.name}" "${event.user.id}"`);

                this.emitter.emit(event.text);
            }
        }
    }

    onError(error) {
        logger.error('Twitter API error', error);
        this.emitter.error(error);
        this.reconnect();
    }

    onEnd(response) {
        logger.error('Twitter stream closed', response);
        this.reconnect();
    }

    reconnect() {
        this.destroy();
        clearTimeout(this.reconnectTimerId);
        this.reconnectTimerId = setTimeout(this.create, RECONNECT_TIMEOUT);
    }

    destroy() {
        logger.info('Destroyed subscription to stream of tweets');

        if (!this.streamOfTweets) {
            return;
        }

        this.streamOfTweets.off('data', this.onNewTweet);
        this.streamOfTweets.off('error', this.onError);
        this.streamOfTweets.off('end', this.onEnd);

        this.streamOfTweets.destroy();

        this.streamOfTweets = null;
    }
}

function Stream(twitterClient) {

    return Kefir.stream((emitter) => {

        const stream = new StreamOfTweets(emitter, twitterClient);
        stream.create();

        return () => {
            stream.destroy();
        }
    });
}

module.exports = Stream;
