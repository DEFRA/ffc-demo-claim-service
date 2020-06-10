const { getSenderConfig } = require('./config-helper')
const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.senderConfig = getSenderConfig(this.name, config)
  }

  decodeMessage (message) {
    try {
      return JSON.stringify(message)
    } catch (ex) {
      throw new Error(`Error converting message to JSON. Message body:${message}`, ex)
    }
  }

  async sendMessage (message) {
    const data = this.decodeMessage(message)
    const sender = await this.connection.createAwaitableSender(this.senderConfig)
    try {
      console.log(`${this.name} sending message`, data)
      const delivery = await sender.send({ body: data })
      console.log(`message sent ${this.name}`)
      return delivery
    } finally {
      await sender.close()
    }
  }
}

module.exports = MessageSender
