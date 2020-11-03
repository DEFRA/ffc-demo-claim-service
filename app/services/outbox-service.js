const { models } = require('./database-service')()
const config = require('../config')
const mqConfig = config.messageQueues
const { MessageSender } = require('ffc-messaging')
let calculationSender
let scheduleSender

async function start () {
  calculationSender = new MessageSender(mqConfig.calculationSender)
  await calculationSender.connect()
  scheduleSender = new MessageSender(mqConfig.scheduleSender)
  await scheduleSender.connect()
  setInterval(publishPendingClaims, config.publishPollingInterval)
}

async function stop () {
  await calculationSender.closeConnection()
  await scheduleSender.closeConnection()
}

async function publishPendingClaims () {
  const claims = await getPendingClaims()
  for (const claim of claims) {
    await calculationSender.sendMessage(claim)
    await scheduleSender.sendMessage(claim)
    await models.claims.update({ published: true }, { where: { claimId: claim.claimId }, fields: ['published'] })
  }
}

async function getPendingClaims () {
  return await models.outbox.findAll({
    where: { published: false },
    include: { model: models.claims, as: 'claim', attributes: [] },
    attributes: [
      'claimId',
      [models.Sequelize.col('claim.propertyType'), 'propertyType'],
      [models.Sequelize.col('claim.dateOfSubsidence'), 'dateOfSubsidence'],
      [models.Sequelize.col('claim.accessible'), 'accessible']
    ]
  })
}

module.exports = { start, stop }
