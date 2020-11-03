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
  return await models.outbox.findAll({
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
  await calculationSender.sendMessage(claim)
  await scheduleSender.sendMessage(claim)
  await models.claims.update({ published: true }, { where: { claimId: claim.claimId }, fields: ['published'] })
  console.info(`Published claim: ${claim.claimId}`)
}

module.exports = { start, stop }
