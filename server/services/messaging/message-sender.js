const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  constructor (name, config, credentials, action) {
    super(name, config, credentials)
    this.config = config
    this.sendMessage = this.sendMessage.bind(this)
  }

  async sendMessage (message) {
    const sender = this.sbClient.createSender(this.config.address)
    try {
      console.log(`${this.name} sending message`, message)

      await sender.sendMessages({ body: message })
      console.log(`message sent ${this.name}`)
    } catch (error) {
      console.error('failed to send message', error)
      throw error
    } finally {
      await sender.close()
    }
    return message
  }
}

module.exports = MessageSender
