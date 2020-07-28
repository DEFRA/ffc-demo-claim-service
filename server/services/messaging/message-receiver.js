const { ReceiveMode } = require('@azure/service-bus')
const MessageBase = require('./message-base')

class MessageReceiver extends MessageBase {
  constructor (name, config, credentials, action) {
    super(name, config, credentials)
    this.receiver = this.queueClient.createReceiver(ReceiveMode.peekLock)
    this.registerEvents = this.registerEvents.bind(this)
    this.registerEvents(action)
  }

  registerEvents (action) {
    const receiverError = (error) => {
      console.log(error)
    }

    const receiverHandler = async (message) => {
      console.log(`${this.name} received message`, message.body)
      try {
        await action(message.body)
      } catch (ex) {
        console.error(`${this.name} error with message`, ex)
      }
    }

    this.receiver.registerMessageHandler(receiverHandler, receiverError)
  }
}

module.exports = MessageReceiver
