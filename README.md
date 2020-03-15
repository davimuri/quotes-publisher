# Quotes Publisher

AWS lambda function that publishes a quote to twitter every time is executed.
The quotes are in a DynamoDB table.

## AWS

* Used `aws-sdk` module for Node.js.
* Used `node-lambda` module as dev dependency to execute lambda locally in test mode and to generate package to deploy. [node-lambda repo](https://github.com/motdotla/node-lambda)

### IAM

* Created a role to associate with Lambda for the execution.
* The role has following permissions
  * AWSLambdaBasicExecutionRole - AWS managed policy
  * DynamoDB Read: BatchGetItem, GetItem, Query, Scan
  * DynamoDB Write: BatchWriteItem, DeleteItem, PutItem, UpdateItem

### DynamoDB

* Examples in [AWS Developer guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html) to CRUD operations in DynamoDB
* I used [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) that provides conversion of DynamoDB data types to JavaScript data types. [Guide how to use it](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-document-client.html)
* Because DocumentClient uses callbacks and doesn't work with promises, I wrapped database operations in promises. For example:

```javascript
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
```

* Structure of quotes stored in DynamoDB is:

```
Item {
  id         -> key of Number Type
  data {     -> Map Type
    number   -> Number Type, same as id
    text     -> String Type, quote text
    links [  -> List Type, references to source of quote, author or book
      {
        href -> String Type, url
        text -> String Type, url description
      }
    ]
  }
}
```

* The quotes are stored as consecutive numbers in id and number fields. Not the best approach but good enough for the purpose of simplicity.
* To identify the next quote to publish I used an special item record in DynamoDB with structure:

```
Item {
  id          -> key of Number Type, value -1
  quoteNumber -> Number Type, last quote number published
}
```

* Having that, to identify the next quote to publish I read record above and I read the quote with id equals to qouteNumber + 1. Then I update the record with new qouteNumber

### Lambda

* Created lambda function in AWS console
* Added a [CloudWatch event trigger with a cron expression](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-expressions.html) like `0 17 ? * MON-FRI *`
* Followed guideline to [build lambda with Node.js](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)

### Alarms

* Created alarms for DynamoDB and Lambda
* Some guide to [create SNS topic and configure alarm](https://docs.aws.amazon.com/lambda/latest/dg/services-cloudwatchevents-tutorial.html#services-cloudwatchevents-tutorial-subscribe)
* Create an SNS topic to send email
* There are 2 alarms created with DynamoDB read and write capacities
  * ConsumedReadCapacityUnits >= 240 for 5 datapoints within 5 minutes
  * ConsumedWriteCapacityUnits >= 240 for 5 datapoints within 5 minutes
* Add the SNS topic to alarms
* Create alarm for lambda errors in CloudWatch
  * Sum of errores >= 1

## Twitter

* Setup twitter account following [Getting started guide](https://developer.twitter.com/en/docs/basics/getting-started). At the end, get API keys and user access tokens
  * API Key (consumer key)
  * API Secret (consumer secret)
  * Access token
  * Access token secret
* Used `twitter-lite` module to interact with Twitter API. [twitter-lite repo](https://github.com/draftbit/twitter-lite)
* Request to post in twitter is `statuses/update`. [API documentation](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update)
* When quote to publish is longer than the limit length of a twit, we can create a thread. To create a thread you need to get the message id returned in each post and include it in the next request.

```javascript
// first post of thread
const params1 =   {
    status: 'first message of thread'
}
const response = await twitter.post('statuses/update', params1)
const previousMessageId = response.id_str

// second post of thread
const params2 = {
  status: 'second message of thread',
  in_reply_to_status_id: previousMessageId
}
const response = await twitter.post('statuses/update', params2)
```