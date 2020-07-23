const auth = require('@azure/ms-rest-nodeauth')
const { ServiceBusClient } = require('@azure/service-bus')
const MessageSender = require('./messaging/message-sender')
const MessageReceiver = require('./messaging/message-receiver')
const { claimMessageAction } = require('./message-action')
const config = require('../config')

class MessageService {
  constructor (credentials) {
    this.publishClaim = this.publishClaim.bind(this)

    this.sbClient = credentials ? ServiceBusClient.createFromAadTokenCredentials(config.messageQueues.host, credentials) : ServiceBusClient.createFromConnectionString(`Endpoint=sb://${config.messageQueues.host}/;SharedAccessKeyName=${config.messageQueues.username};SharedAccessKey=${config.messageQueues.password}`)
    this.calculationSender = new MessageSender('claim-service-calculation-sender', config.messageQueues.calculationQueue.address, this.sbClient)
    this.scheduleSender = new MessageSender('claim-service-schedule-sender', config.messageQueues.scheduleQueue.address, this.sbClient)
    this.claimReceiver = new MessageReceiver('claim-service-claim-receiver', config.messageQueues.claimQueue.address, this.sbClient)
  }

  async registerQueues () {
    await this.claimReceiver.setupReceiver(claim => {
      claimMessageAction(claim, this.publishClaim)
    })
  }

  async closeConnections () {
    await this.sbClient.close()
  }

  async publishClaim (claim) {
    try {
      await Promise.all([
        this.calculationSender.sendMessage(claim),
        this.scheduleSender.sendMessage(claim)
      ])
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

module.exports = (async () => {
  const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
  return new MessageService(credentials)
})()
