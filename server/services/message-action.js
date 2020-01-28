const MessageSender = require('./messaging/message-sender')
const config = require('../config')

async function messageAction (message) {
  const claim = JSON.parse(message.Body)
  console.log('received message ', claim)

  const value = calculationService.calculate(claim)

  const sender = new MessageSender(config.paymentQueueConfig, config.paymentQueueConfig.queueUrl)
  const messageBody = { claimId: claim.claimId, value }
  console.log('sending message ', messageBody)
  await sender.sendMessage(messageBody)
}

module.exports = { messageAction }