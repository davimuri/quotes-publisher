const config = require('./config')
const publishToTwitter = require('./twitter_publisher')
const split = require('./text_splitter')
const db = require('./database')

exports.handler = async (event, context) => {
  try {
    const quote = await db.getNextQuoteToPublish()
    console.log(quote)
    const splittedText = split(quote.data.text, 275, false, true)
    console.log(splittedText)
    if (config.NODE_ENV === 'production') {
      await publishToTwitter(splittedText)
      const updateResult = await db.updateQuoteNumber(quote.id)
      console.log(updateResult)  
    }

    return {
      statusCode: 200,
      message: `Published quote id ${quote.id}`
    }
  } catch (error) {
    console.error(error)
    return error
  }
}
