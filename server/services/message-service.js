const { claimMessageAction } = require('./claim-message-action')
const createQueue = require('./messaging/create-queue')
const MessageConsumer = require('./messaging/message-consumer')
const config = require('../config')
let claimConsumer

async function registerService () {
  if (config.calculationQueueConfig.createQueue) {
    await createQueue(config.calculationQueueConfig.name, config.calculationQueueConfig)
  }

  if (config.scheduleQueueConfig.createQueue) {
    await createQueue(config.scheduleQueueConfig.name, config.scheduleQueueConfig)
  }

  if (config.claimQueueConfig.createQueue) {
    await createQueue(config.claimQueueConfig.name, config.claimQueueConfig)
  }

  registerClaimConsumer()
}

function registerClaimConsumer () {
  claimConsumer = new MessageConsumer(config.claimQueueConfig, config.claimQueueConfig.queueUrl, claimMessageAction)
  claimConsumer.start()
}

function closeConnections () {
  claimConsumer.stop()
}

module.exports = {
  closeConnections,
  registerService
}
