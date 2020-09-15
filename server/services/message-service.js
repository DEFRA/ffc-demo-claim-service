const { DefaultAzureCredential } = require('@azure/identity')
const config = require('../config')
const mqConfig = config.messageQueues
const { claimMessageAction } = require('./message-action')
const MessageReceiver = require('./messaging/message-receiver')
const MessageSender = require('./messaging/message-sender')

class MessageService {
  constructor (credentials) {
    this.publishClaim = this.publishClaim.bind(this)
    this.calculationSender = new MessageSender('claim-service-calculation-sender', mqConfig.calculationQueue, credentials)
    this.scheduleSender = new MessageSender('claim-service-schedule-sender', mqConfig.scheduleQueue, credentials)
    const claimAction = claim => claimMessageAction(claim, this.publishClaim)
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

module.exports = async function () {
  // TODO: might need additional information here
  // This should also work if env vars are set for development purposes so there would be no need to have branches depending on env
  const credentials = config.isProd ? new DefaultAzureCredential() : undefined
  return new MessageService(credentials)
}
