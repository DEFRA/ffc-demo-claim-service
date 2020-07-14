const { getSenderConfig } = require('./config-helper')
const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.senderConfig = getSenderConfig(this.name, config)
  }

  stringifyMessage (message) {
    try {
      return JSON.stringify(message)
    } catch (ex) {
      throw new Error(`Error converting message to JSON. Message body:${message}`, ex)
    }
  }

  async sendMessage (message) {
    const body = this.stringifyMessage(message)
    const queueClient = this.sbClient.createQueueClient(this.senderConfig.target.address)
    const sender = queueClient.createSender()
    try {
      console.log(`${this.name} sending message`, message)

      await sender.send({ body })
      console.log(`message sent ${this.name}`)
    } finally {
      await sender.close()
    }
  }
}

module.exports = MessageSender
