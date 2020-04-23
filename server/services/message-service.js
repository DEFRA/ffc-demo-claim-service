const createQueue = require('./messaging/create-queue')
const MessageSender = require('./messaging/message-sender')
const config = require('../config')

const calculationSender = new MessageSender(config.calculationQueueConfig, config.calculationQueueConfig.queueUrl)
const scheduleSender = new MessageSender(config.scheduleQueueConfig, config.scheduleQueueConfig.queueUrl)

async function createQueuesIfRequired () {
  if (config.calculationQueueConfig.createQueue) {
    await createQueue(config.calculationQueueConfig.name, config.calculationQueueConfig)
  }
  if (config.scheduleQueueConfig.createQueue) {
    await createQueue(config.scheduleQueueConfig.name, config.scheduleQueueConfig)
  }
}

async function publishClaim (claim) {
  try {
    const calculationMessage = getCalculationMessage(claim)
    const scheduleMessage = getScheduleMessage(claim)

    await Promise.all([
      calculationSender.sendMessage(calculationMessage),
      scheduleSender.sendMessage(scheduleMessage)
    ])
  } catch (err) {
    console.log(err)
    throw err
  }
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
  publishClaim,
  createQueuesIfRequired,
  getCalculationMessage,
  getScheduleMessage
}
