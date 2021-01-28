const config = require('../../config')
const mqConfig = config.messageQueues
const { MessageSender } = require('ffc-messaging')
const publishPendingClaims = require('./publish-pending')
let calculationSender
let scheduleSender

async function start () {
  calculationSender = new MessageSender(mqConfig.calculationQueue)
  await calculationSender.connect()
  scheduleSender = new MessageSender(mqConfig.scheduleTopic)
  await scheduleSender.connect()
  setInterval(() => publishPendingClaims(calculationSender, scheduleSender), config.publishPollingInterval)
  console.info('Outbox service running, ready to publish claims')
}

async function stop () {
  await calculationSender.closeConnection()
  await scheduleSender.closeConnection()
}

module.exports = { start, stop }
