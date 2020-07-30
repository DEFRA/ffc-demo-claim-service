const auth = require('@azure/ms-rest-nodeauth')
const config = require('../config')
const mqConfig = config.messageQueues
const { claimMessageAction } = require('./message-action')
const MessageReceiver = require('./messaging/message-receiver')
const MessageSender = require('./messaging/message-sender')

process.on('SIGTERM', async function () {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await messageService.closeConnections()
  process.exit(0)
})

class MessageService {
  constructor (credentials) {
    this.publishClaim = this.publishClaim.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.calculationSender = new MessageSender('claim-service-calculation-sender', mqConfig.calculationQueue, credentials)
    this.scheduleSender = new MessageSender('claim-service-schedule-sender', mqConfig.scheduleQueue, credentials)
    const claimAction = claim => claimMessageAction(claim, messageService.publishClaim)
    this.claimReceiver = new MessageReceiver('claim-service-claim-receiver', mqConfig.claimQueue, credentials, claimAction)
  }

  async closeConnections () {
    await this.calculationSender.closeConnection()
    await this.scheduleSender.closeConnection()
    await this.claimReceiver.closeConnection()
  }

  async publishClaim (claim) {
    try {
      return await Promise.all([
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
  }
  return messageService
}())
