const get = require('lodash.get');

const getUserId = (obj) => {
  return get(obj, 'user.id') || null;
};

const getUserName = (obj) => {
  return get(obj, 'user.name') || null;
};

const getTweet = (obj) => {
  return get(obj, 'extended_tweet.full_text') || get(obj, 'text') || null;
};

const getRetweetedTweet = (obj) => {
  return get(obj, 'retweeted_status') || null;
};

const getQuotedTweet = (obj) => {
  const quoted = get(obj, 'quoted_status') || null;
  if (quoted !== null) {
    return getTweet(quoted)
  }
  return quoted;
};

const getQuotedUser = (obj) => {
  const quoted = get(obj, 'quoted_status') || null;
  if (quoted !== null) {
    return getUserName(quoted)
  }
  return quoted;
};

const getReplyToStatusId = (obj) => {
  return get(obj, 'in_reply_to_status_id') || null;
};

module.exports = {
  getUserId,
  getUserName,
  getTweet,
  getRetweetedTweet,
  getQuotedTweet,
  getQuotedUser,
  getReplyToStatusId,
};

