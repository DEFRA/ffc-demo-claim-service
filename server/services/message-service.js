const createQueue = require('./messaging/create-queue')
const MessageSender = require('./messaging/message-sender')
const MessageConsumer = require('./messaging/message-consumer')
const claimService = require('../services/claim-service')
const config = require('../config')
let claimConsumer

const calculationSender = new MessageSender(config.calculationQueueConfig, config.calculationQueueConfig.queueUrl)
const scheduleSender = new MessageSender(config.scheduleQueueConfig, config.scheduleQueueConfig.queueUrl)

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
  claimConsumer = new MessageConsumer(config.claimQueueConfig, config.claimQueueConfig.queueUrl, receiveClaim)
  claimConsumer.start()
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

async function receiveClaim (message) {
  try {
    console.log('message received - claim ', message.Body)
    const claim = JSON.parse(message.Body)
    await claimService.create(claim)
  } catch (ex) {
    console.error('unable to process message ', ex)
  }
}

process.on('SIGTERM', async function () {
  await closeConnections()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await closeConnections()
  process.exit(0)
})

async function closeConnections () {
  claimConsumer.stop()
}

module.exports = {
  publishClaim,
  closeConnections,
  registerService
}
