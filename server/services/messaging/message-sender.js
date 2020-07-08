const appInsights = require('applicationinsights')
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
    let startTime
    let success = true
    let resultCode = 200

    const data = this.decodeMessage(message)
    const sender = await this.connection.createAwaitableSender(this.senderConfig)
    try {
      startTime = Date.now()
      // TODO: operationId will need to passed through on the object if it isn't
      // available on appInsights object
      // const operationId = context.message.operationId
      // appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.operationId] = operationId
      // this is rubbish - just null!
      console.log('appInsights.defaultClient.context:', appInsights.defaultClient.context)
      console.log('appInsights.getCorrelationContext:', appInsights.getCorrelationContext())

      const msg = { body: data, operationId: 'tbc' }
      console.log(msg)

      console.log(`${this.name} sending message`, msg)
      const delivery = await sender.send(msg)
      console.log(`message sent ${this.name}`)
      return delivery
    } catch (error) {
      success = false
      resultCode = 500
      console.error('failed to send message', error)
      throw error
    } finally {
      const duration = Date.now() - startTime
      appInsights.defaultClient.trackDependency({ data, dependencyTypeName: 'AMQP', duration, name: this.name, resultCode, success, target: this.senderConfig.target.address })
      await sender.close()
    }
  }
}

module.exports = MessageSender
