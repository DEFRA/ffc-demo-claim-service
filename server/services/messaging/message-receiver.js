const rheaPromise = require('rhea-promise')
const { getReceiverConfig } = require('./config-helper')
const MessageBase = require('./message-base')
const appInsights = require('applicationinsights')

class MessageReceiver extends MessageBase {
  constructor (name, config) {
    super(name, config)
    this.receiverConfig = getReceiverConfig(this.name, config)
  }

  registerEvents (receiver, action) {
    receiver.on(rheaPromise.ReceiverEvents.message, async (context) => {
      // context is no good, it just contains the keys and the tags
      console.log(appInsights.defaultClient.context)
      console.log('***********************')
      const phonyReq = {
        name: 'phony',
        url: 'message-queue',
        duration: 0,
        resultCode: 200,
        success: true,
        contextObjects: { ctx: 'here' }
      }
      console.log(appInsights.defaultClient.trackRequest(phonyReq))
      console.log('track***********************')
      console.log(appInsights.defaultClient.context)
      console.log('***********************')
      // console.log(context)
      console.log('***********************')
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
