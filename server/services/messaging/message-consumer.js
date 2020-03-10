const { Consumer } = require('sqs-consumer')
const AWS = require('aws-sdk')

class MessageConsumer {
  constructor (queueConfig, queueUrl, messageHandler) {
    this.createConsumer(queueConfig, queueUrl, messageHandler)
    this.registerErrorEvents()
  }

  createConsumer (queueConfig, queueUrl, messageAction) {
    this.app = Consumer.create({
      queueUrl,
      handleMessage: messageAction,
      sqs: new AWS.SQS(queueConfig)
    })
  }

  registerErrorEvents () {
    const _this = this
    this.app.on('error', (err) => {
      _this.handleError(err)
    })

    this.app.on('processing_error', (err) => {
      _this.handleError(err)
    })

    this.app.on('timeout_error', (err) => {
      _this.handleError(err)
    })
  }

  handleError (err) {
    console.error(err.message)
  }

  start () {
    this.app.start()
    console.log('message polling started')
  }

  stop () {
    this.app.stop()
  }
}

module.exports = MessageConsumer
