const { ReceiveMode } = require('@azure/service-bus')
const MessageBase = require('./message-base')

class MessageReceiver extends MessageBase {
  constructor (name, config, credentials, action) {
    super(name, config, credentials)
    this.receiverHandler = this.receiverHandler.bind(this)
    this.action = action
    const receiver = this.queueClient.createReceiver(ReceiveMode.peekLock)
    receiver.registerMessageHandler(this.receiverHandler, this.receiverError)
  }

  receiverError (error) {
    console.log(error)
  }

  async receiverHandler (message) {
    console.log(`${this.name} received message`, message.body)
    try {
      await this.action(message.body)
    } catch (ex) {
      console.error(`${this.name} error with message`, ex)
    }
  }
}

module.exports = MessageReceiver
