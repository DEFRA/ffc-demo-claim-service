const AWS = require('aws-sdk')

function createQueue (name, config, visibilityTimeout = 2) {
  const sqs = new AWS.SQS(config)
  const params = {
    QueueName: name,
    Attributes: {
      DelaySeconds: '0',
      VisibilityTimeout: visibilityTimeout.toString(),
      ReceiveMessageWaitTimeSeconds: '0'
    }
  }
  return sqs.createQueue(params).promise()
}

module.exports = createQueue
