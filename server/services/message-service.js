const MessageSender = require('./messaging/message-sender')
const MessageReceiver = require('./messaging/message-receiver')
const { claimMessageAction } = require('./message-action')
const mqconfig = require('../config/mq-config')

const calculationSender = new MessageSender('claim-service-calculation-sender', mqconfig.calculationQueue)
const scheduleSender = new MessageSender('claim-service-schedule-sender', mqconfig.scheduleQueue)
const claimReceiver = new MessageReceiver('claim-service-claim-receiver', mqconfig.claimQueue)

async function registerQueues () {
  await openConnections()
  await claimReceiver.setupReceiver(claim => {
    claimMessageAction(claim, publishClaim)
  })
}

async function closeConnections () {
  await calculationSender.closeConnection()
  await scheduleSender.closeConnection()
  await claimReceiver.closeConnection()
}

async function openConnections () {
  await calculationSender.openConnection()
  await scheduleSender.openConnection()
  await claimReceiver.openConnection()
}

async function publishClaim (claim) {
  try {
    console.log('calculationSender connected', calculationSender.isConnected())
    console.log('scheduleSender connected', scheduleSender.isConnected())
    const deliveries = await Promise.all([
      calculationSender.sendMessage(claim),
      scheduleSender.sendMessage(claim)
    ])
    for (const delivery of deliveries) {
      console.log(delivery.settled)
    }
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
  openConnections,
  publishClaim,
  registerQueues,
  getCalculationMessage,
  getScheduleMessage
}
