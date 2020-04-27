const MessageSender = require('./messaging/message-sender')
const config = require('../config')

const calculationSender = new MessageSender(config.calculationQueueConfig, config.calculationQueueConfig.queueUrl)
const scheduleSender = new MessageSender(config.scheduleQueueConfig, config.scheduleQueueConfig.queueUrl)

async function publishMessageAction (claim) {
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
  publishMessageAction,
  getCalculationMessage,
  getScheduleMessage
}
