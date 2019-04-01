const db = require('../models')

module.exports = {
  getById: async function (claimId) {
    try {
      return db.claims.findOne({
        where: {
          claimId: claimId
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  create: async function (claim) {
    try {
      let claimRecord = await db.claims.upsert({
        claimId: claim.claimId,
        propertyType: claim.propertyType,
        accessible: claim.accessible,
        dateOfSubsidence: claim.dateOfSubsidence
      })

      return claimRecord
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
