const { getSenderConfig } = require('./config-helper')
const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.senderConfig = getSenderConfig(this.name, config)
  }

  async sendMessage (message) {
    const queueClient = this.sbClient.createQueueClient(this.senderConfig.target.address)
    const sender = queueClient.createSender()
    try {
      console.log(`${this.name} sending message`, message)

      await sender.send({ body: message })
      console.log(`message sent ${this.name}`)
    } finally {
      await sender.close()
    }
  }
}

module.exports = MessageSender
