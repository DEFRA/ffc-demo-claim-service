const { ReceiveMode, ServiceBusClient } = require('@azure/service-bus')
const { getReceiverConfig } = require('./config-helper')
const MessageBase = require('./message-base')

class MessageReceiver extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.receiverConfig = getReceiverConfig(this.name, config)
  }

  registerEvents (receiver, action) {
    const receiverError = (error) => {
      console.log(error)
    }

    const receiverHandler = async (msg) => {
      console.log(`${this.name} received message`, msg.body)
      try {
        const message = JSON.parse(msg.body)
        await action(message)
      } catch (ex) {
        console.error(`${this.name} error with message`, ex)
      }
    }

    receiver.registerMessageHandler(receiverHandler, receiverError)
  }

  async setupReceiver (action) {
    const queueClient = this.sbClient.createQueueClient(this.receiverConfig.source.address)
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock)
    this.registerEvents(receiver, action)
  }
}

module.exports = MessageReceiver
