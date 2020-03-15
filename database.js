const aws = require('aws-sdk')
const config = require('./config')

aws.config.update({
  region: config.AWS_REGION
})

const TABLE_NAME = 'quotes'
const docClient = new aws.DynamoDB.DocumentClient()

const getNextQuoteToPublish = async () => {
  const quoteId = await getNextQuoteNumberAsync()
  const quote = await getQuoteAsync(quoteId)
  return quote
}

const getNextQuoteNumberAsync = async () => {
  const item = await getQuoteAsync(-1)
  return item.quoteNumber + 1
}

const getQuoteAsync = async (id) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        'id': id
      }
    }
    docClient.get(params, (error, data) => {
      if (error) reject(error)
      if (data.Item) resolve(data.Item)
    })
  })
}

const updateQuoteNumber = async (idPublished) => {
  return new Promise((resolve, reject) => {
    var params = {
      TableName: TABLE_NAME,
      Key:{
          "id": -1
      },
      UpdateExpression: "set quoteNumber = :val",
      ExpressionAttributeValues: { ":val": idPublished },
      ReturnValues: "UPDATED_NEW"
    }
  
    docClient.update(params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

module.exports = {
  getNextQuoteToPublish,
  updateQuoteNumber
}