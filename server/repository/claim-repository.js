const db = require('../models')

module.exports = {
  getById: async function (claimId) {
    try {
      return await db.claims.findOne({
        where: {
          claimId: claimId
        }
      })
    } catch (err) {
      throw err
    }
  },
  create: async function (claim) {
    try {
      const claimRecord = await db.claims.upsert({
        claimId: claim.claimId,
        propertyType: claim.propertyType,
        accessible: claim.accessible,
        dateOfSubsidence: claim.dateOfSubsidence
      })

      return claimRecord
    } catch (err) {
      throw err
    }
  }
}
