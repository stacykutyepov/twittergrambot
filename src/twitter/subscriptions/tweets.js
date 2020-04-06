const Kefir = require('kefir');
const logger = require('../../utils/logger')(__filename);
const {
  getUserId,
  getUserName,
  getTweet,
  getRetweetedTweet,
  getQuotedTweet,
  getQuotedUser,
  getReplyToStatusId,
} = require('../internal/selectors');

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
    const userId = getUserId(event);
    const userName = getUserName(event);
    const tweet = getTweet(event);
    const isRetweet = getRetweetedTweet(event) !== null;
    const isReply = getReplyToStatusId(event) !== null;
    if (userId === FOLLOWING && tweet && !isRetweet && !isReply) {
      let processedTweet = tweet;
      const quotedTweet = getQuotedTweet(event);
      if(quotedTweet) {
        processedTweet = `<i><b>${userName}</b> tweets:</i>\n\n${processedTweet}\n\n<i>in reply to the tweet of <b>${getQuotedUser(event)}</b></i>\n\n${quotedTweet}`;
      }

      logger.info(`New tweet ${processedTweet} from "${userName}" "${userId}"`);
      this.emitter.emit(processedTweet);
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
