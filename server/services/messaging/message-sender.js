class MessageSender {
  constructor (name, queueName, sbClient) {
    this.name = name
    this.queueName = queueName
    this.sbClient = sbClient
  }

  async sendMessage (message) {
    const queueClient = this.sbClient.createQueueClient(this.queueName)
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
