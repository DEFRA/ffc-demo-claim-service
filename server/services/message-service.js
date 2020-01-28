const { messageAction }= require('./messaging/message-action')
const MessageConsumer = require('./messaging/message-consumer')
const createQueue = require('./messaging/create-queue')
const config = require('../config')

const calculationSender = new MessageSender('claim-service-calculation-sender', config.messageQueues.calculationQueue)
const scheduleSender = new MessageSender('claim-service-schedule-sender', config.messageQueues.scheduleQueue)

let consumer

async function registerService () {
  if (config.calculationQueueConfig.createQueue) {
    await createQueue(config.calculationQueueConfig.name, config.calculationQueueConfig)
  }
  if (config.paymentQueueConfig.createQueue) {
    await createQueue(config.paymentQueueConfig.name, config.paymentQueueConfig)
  }
  registerCalculationConsumer()
}

function registerCalculationConsumer () {
  consumer = new MessageConsumer(config.calculationQueueConfig, config.calculationQueueConfig.queueUrl, messageAction)
  consumer.start()
}

async function closeConnections () {
  consumer.stop()
}



async function publishClaim (claim) {
  try {
    console.log('calculationSender connected', calculationSender.isConnected())
    console.log('scheduleSender connected', scheduleSender.isConnected())
    const delivery = await Promise.all([
      calculationSender.sendMessage(claim),
      scheduleSender.sendMessage(claim)
    ])
    delivery.map(del => { console.log(del.settled) })
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

module.exports = {
  closeConnections,
  getCalculationSender,
  getScheduleSender,
  openConnections,
  publishClaim,
  registerService
}
