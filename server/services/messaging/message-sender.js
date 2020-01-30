const AWS = require('aws-sdk')

class MessageSender {
  constructor (queueConfig, queueUrl) {
    this.sqs = new AWS.SQS(queueConfig)
    this.queueUrl = queueUrl
  }

  decodeMessage (message) {
    try {
      return JSON.stringify(message)
    } catch (ex) {
      throw new Error(`Error converting message to JSON. Message body:${message}`, ex)
    }
  }

  async sendMessage (message) {
    const jsonMessage = JSON.stringify(message)
    try {
      console.log(`sending ${message} to ${this.queueUrl}`)
      return this.sqs.sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: jsonMessage
      }).promise()
    } catch (ex) {
      console.error(`error sending message '${jsonMessage}' to queue`, ex)
      throw ex
    }
  }
}

module.exports = MessageSender
