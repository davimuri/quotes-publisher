require('dotenv').config()

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const AWS_REGION = process.env.AWS_REGION
const NODE_ENV = process.env.NODE_ENV

if (NODE_ENV === 'test') {
    // setup variables for test environment
}

module.exports = {
  NODE_ENV,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  ACCESS_TOKEN,
  ACCESS_TOKEN_SECRET,
  AWS_REGION
}
