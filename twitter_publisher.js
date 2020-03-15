const Twitter = require('twitter-lite')
const config = require('./config')

const newTwitterClient = () => {
  return new Twitter({
    subdomain: 'api',
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    access_token_key: config.ACCESS_TOKEN,
    access_token_secret: config.ACCESS_TOKEN_SECRET,
  })
}

const twitter = newTwitterClient()

const statusUpdateParams = (message, previousMessageId) => {
  if (previousMessageId) {
    return {
      status: message,
      in_reply_to_status_id: previousMessageId
    }
  }
  return {
    status: message
  }
}

const publishToTwitter = async (messages) => {
  let previousMessageId = null
  for (let i = 0; i < messages.length; i++ ) {
    const params = statusUpdateParams(messages[i], previousMessageId)
    const response = await twitter.post('statuses/update', params)
    previousMessageId = response.id_str
    //console.log(`twit created ${previousMessageId}`)
  }
}

module.exports = publishToTwitter