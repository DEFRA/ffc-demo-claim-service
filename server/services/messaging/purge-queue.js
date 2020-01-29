const AWS = require('aws-sdk')

function purgeQueue (name, config) {
  const sqs = new AWS.SQS(config)
  return sqs.purgeQueue({ QueueUrl: name }).promise()
}

module.exports = purgeQueue
