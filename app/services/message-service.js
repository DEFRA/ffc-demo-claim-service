const config = require('../config')
const mqConfig = config.messageQueues
const { claimMessageAction } = require('./message-action')
const { MessageReceiver, MessageSender } = require('ffc-messaging')

class MessageService {
  constructor () {
    this.publishClaim = this.publishClaim.bind(this)
    this.calculationSender = new MessageSender(mqConfig.calculationQueue)
    this.scheduleSender = new MessageSender(mqConfig.scheduleQueue)
    const claimAction = claim => claimMessageAction(claim, this.publishClaim)
    this.claimReceiver = new MessageReceiver(mqConfig.claimQueue, claimAction)
  }

  async start () {
    await this.calculationSender.connect()
    await this.scheduleSender.connect()
    await this.claimReceiver.connect()
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
  return new MessageService()
}
