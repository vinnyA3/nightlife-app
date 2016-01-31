module.exports = {
  //'db': 'mongodb://127.0.0.1:27017/nightlife_db',
  'db' : 'mongodb://ace:qwertyasdf@ds047095.mongolab.com:47095/nightlife_db', //remote    
  'secret' : 'theregoesamanwhooncehaditall',
  //OAuth 2.0
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'e8388c27965b3cf6dfbcba27b76cd73f',
  // OAuth 1.0
  TWITTER_KEY: process.env.TWITTER_KEY || 'YOUR_TWITTER_CONSUMER_KEY',
  TWITTER_SECRET: process.env.TWITTER_SECRET || 'YOUR_TWITTER_CONSUMER_SECRET'
};