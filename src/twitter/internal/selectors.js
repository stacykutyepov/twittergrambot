const get = require('lodash.get');

const getUserId = (obj) => {
  return get(obj, 'user.id') || null;
};

const getUserName = (obj) => {
  return get(obj, 'user.name') || null;
};

const getFullTweet = (obj) => {
  return get(obj, 'extended_tweet.full_text') || null;
};

const getTweet = (obj) => {
  return get(obj, 'text') || null;
};

module.exports = {
  getUserId,
  getUserName,
  getFullTweet,
  getTweet,
};

