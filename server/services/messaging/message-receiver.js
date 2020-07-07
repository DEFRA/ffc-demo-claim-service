const appInsights = require('applicationinsights')
const rheaPromise = require('rhea-promise')
const { getReceiverConfig } = require('./config-helper')
const MessageBase = require('./message-base')

class MessageReceiver extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.receiverConfig = getReceiverConfig(this.name, config)
  }

  registerEvents (receiver, action) {
    receiver.on(rheaPromise.ReceiverEvents.message, async (context) => {
      const processingStartTime = Date.now()
      // console.log('context:', context)
      // TODO: Might want to add other properties into the overrides
      const msgCreationTime = context.message.creation_time
      const [traceId, spanId] = context.message.correlation_id.split('.')
      const tagOverrides = {}
      tagOverrides[appInsights.defaultClient.context.keys.operationId] = traceId
      tagOverrides[appInsights.defaultClient.context.keys.operationParentId] = spanId

      const requestTelemetry = {
        // this might be a bit of a silly measure but then again...
        duration: msgCreationTime - processingStartTime,
        name: this.name,
        resultCode: 200,
        source: `AMQP message from ${this.receiverConfig.source.address}`,
        success: true,
        tagOverrides,
        url: this.receiverConfig.source.address
      }

      console.log('call trackRequest with requestTelemetry object:', requestTelemetry)
      appInsights.defaultClient.trackRequest(requestTelemetry)

      console.log(`${this.name} received message`, context.message.body)
      try {
        const message = JSON.parse(context.message.body)
        await action(message)
      } catch (ex) {
        console.error(`${this.name} error with message`, ex)
      }
    })

    receiver.on(rheaPromise.ReceiverEvents.receiverError, context => {
      const receiverError = context.receiver && context.receiver.error
      if (receiverError) {
        console.error(`${this.name} receipt error`, receiverError)
      }
    })
  }

  async setupReceiver (action) {
    const receiver = await this.connection.createReceiver(this.receiverConfig)
    this.registerEvents(receiver, action)
  }
}

module.exports = MessageReceiver
