const MessageSender = require('./messaging/sb-message-sender')
const MessageReceiver = require('./messaging/sb-message-receiver')
const { claimMessageAction } = require('./message-action')
const config = require('../config')

const calculationSender = new MessageSender('claim-service-calculation-sender', config.messageQueues.calculationQueue)
const scheduleSender = new MessageSender('claim-service-schedule-sender', config.messageQueues.scheduleQueue)
const claimReceiver = new MessageReceiver('claim-service-claim-receiver', config.messageQueues.claimQueue)

async function registerQueues () {
  await claimReceiver.setupReceiver(claim => {
    claimMessageAction(claim, publishClaim)
  })
}

async function closeConnections () {
  await calculationSender.closeConnection()
  await scheduleSender.closeConnection()
  await claimReceiver.closeConnection()
}

async function publishClaim (claim) {
  try {
    await Promise.all([
      calculationSender.sendMessage(claim),
      scheduleSender.sendMessage(claim)
    ])
  } catch (err) {
    console.log(err)
    throw err
  }
}

function getCalculationSender () {
  return calculationSender
}

function getScheduleSender () {
  return scheduleSender
}

function getCalculationMessage (claim) {
  return claim
}

function getScheduleMessage (claim) {
  return {
    claimId: claim.claimId
  }
}

module.exports = {
  closeConnections,
  getCalculationSender,
  getScheduleSender,
  publishClaim,
  registerQueues,
  getCalculationMessage,
  getScheduleMessage
}
