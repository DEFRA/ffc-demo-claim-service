const { models } = require('../services/database-service')

module.exports = {
  getById: async function (claimId) {
    return models.claims.findOne({
      where: {
        claimId: claimId
      }
    })
  },
  create: async function (claim) {
    return models.claims.upsert({
      claimId: claim.claimId,
      propertyType: claim.propertyType,
      accessible: claim.accessible,
      dateOfSubsidence: claim.dateOfSubsidence,
      email: claim.email || 'joe.bloggs@defra.gov.uk'
    })
  }
}
