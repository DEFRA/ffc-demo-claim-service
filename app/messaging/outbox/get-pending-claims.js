const { models, sequelize } = require('../../services/database-service')()

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

module.exports = getPendingClaims
