const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const MessageReceiver = require('./messaging/message-receiver')
const { claimMessageAction } = require('./message-action')
const config = require('../config')

let calculationSender
let scheduleSender
let claimReceiver

async function createConnections () {
  const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
  calculationSender = new MessageSender('claim-service-calculation-sender', config.messageQueues.calculationQueue, credentials)
  scheduleSender = new MessageSender('claim-service-schedule-sender', config.messageQueues.scheduleQueue, credentials)
  claimReceiver = new MessageReceiver('claim-service-claim-receiver', config.messageQueues.claimQueue, credentials)
}

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
  createConnections,
  getCalculationSender,
  getScheduleSender,
  publishClaim,
  registerQueues,
  getCalculationMessage,
  getScheduleMessage
}
