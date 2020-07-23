const { ReceiveMode } = require('@azure/service-bus')

class MessageReceiver {
  constructor (name, queueName, sbClient) {
    this.name = name
    this.queueName = queueName
    this.sbClient = sbClient
  }

  registerEvents (receiver, action) {
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

    receiver.registerMessageHandler(receiverHandler, receiverError)
  }

  async setupReceiver (action) {
    const queueClient = this.sbClient.createQueueClient(this.queueName)
    const receiver = queueClient.createReceiver(ReceiveMode.peekLock)
    this.registerEvents(receiver, action)
  }
}

module.exports = MessageReceiver
