const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  async sendMessage (message) {
    const sender = this.queueClient.createSender()
    try {
      console.log(`${this.name} sending message`, message)

      await sender.send({ body: message })
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
