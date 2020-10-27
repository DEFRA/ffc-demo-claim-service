const MessageBase = require('./message-base')
const appInsights = require('applicationinsights')
const AppInsightsUtil = require('../../../util/app-insights-util')

class MessageSender extends MessageBase {
  constructor (name, config, credentials, action) {
    super(name, config, credentials)
    this.sendMessage = this.sendMessage.bind(this)
  }

  async sendMessage (message) {
    const sender = this.queueClient.createSender()
    try {
      console.log(`${this.name} sending message`, message)

      const appInsightsService = AppInsightsUtil(appInsights.defaultClient)

      appInsightsService.logTraceMessage(`Trace Sender - ${this.name}`)

      await sender.send({ body: message, correlationId: appInsightsService.getOperationId() })
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
