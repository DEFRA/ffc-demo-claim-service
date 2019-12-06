const db = require('../models')

module.exports = {
  getById: async function (claimId) {
    return db.claims.findOne({
      where: {
        claimId: claimId
      }
    })
  },
  create: async function (claim) {
    return db.claims.upsert({
      claimId: claim.claimId,
      propertyType: claim.propertyType,
      accessible: claim.accessible,
      dateOfSubsidence: claim.dateOfSubsidence
    })
  }
}
