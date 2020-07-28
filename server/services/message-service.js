const auth = require('@azure/ms-rest-nodeauth')
const config = require('../config')
const { claimMessageAction } = require('./message-action')
const MessageReceiver = require('./messaging/message-receiver')
const MessageSender = require('./messaging/message-sender')

class MessageService {
  constructor (credentials) {
    this.publishClaim = this.publishClaim.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.calculationSender = new MessageSender('claim-service-calculation-sender', config.messageQueues.calculationQueue, credentials)
    this.scheduleSender = new MessageSender('claim-service-schedule-sender', config.messageQueues.scheduleQueue, credentials)
    this.claimReceiver = new MessageReceiver('claim-service-claim-receiver', config.messageQueues.claimQueue, credentials)
  }

  async closeConnections () {
    await this.calculationSender.closeConnection()
    await this.scheduleSender.closeConnection()
    await this.claimReceiver.closeConnection()
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

let messageService

module.exports = (async function createConnections () {
  if (!messageService) {
    const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
    messageService = new MessageService(credentials)
    await messageService.claimReceiver.setupReceiver(claim => {
      claimMessageAction(claim, messageService.publishClaim)
    })
  }
  return messageService
}())
