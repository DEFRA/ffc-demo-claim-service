const { models, sequelize } = require('./database-service')()
const config = require('../config')
const mqConfig = config.messageQueues
const { MessageSender } = require('ffc-messaging')
let calculationSender
let scheduleSender

async function start () {
  calculationSender = new MessageSender(mqConfig.calculationQueue)
  await calculationSender.connect()
  scheduleSender = new MessageSender(mqConfig.scheduleQueue)
  await scheduleSender.connect()
  setInterval(publishPendingClaims, config.publishPollingInterval)
  console.info('Outbox service running')
}

async function stop () {
  await calculationSender.closeConnection()
  await scheduleSender.closeConnection()
}

async function publishPendingClaims () {
  const claims = await getPendingClaims()
  for (const claim of claims) {
    await publishClaim(claim)
  }
}

async function getPendingClaims () {
  return models.outbox.findAll({
    raw: true,
    where: { published: false },
    include: { model: models.claims, as: 'claim', attributes: [] },
    attributes: [
      'claimId',
      [sequelize.col('claim.propertyType'), 'propertyType'],
      [sequelize.col('claim.dateOfSubsidence'), 'dateOfSubsidence'],
      [sequelize.col('claim.accessible'), 'accessible']
    ]
  })
}

async function publishClaim (claim) {
  try {
    const message = createMessage(claim)
    await calculationSender.sendMessage(message)
    await scheduleSender.sendMessage(message)
    await models.outbox.update({ published: true }, { where: { claimId: claim.claimId } })
    console.info(`Published claim: ${claim.claimId}`)
  } catch (err) {
    console.error('Unable to send claim: ', err)
  }
}

function createMessage (claim) {
  return {
    body: claim,
    type: 'uk.gov.demo.claim.validated',
    source: 'ffc-demo-claim-service'
  }
}

module.exports = { start, stop, createMessage }
