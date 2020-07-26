const db = require('../models')

module.exports = {
  getById: async function (claimId) {
    console.log('getById', claimId)
    const model = await db
    console.log('model', model)
    return model.claims.findOne({
      where: {
        claimId: claimId
      }
    })
  },
  create: async function (claim) {
    return (await db).claims.upsert({
      claimId: claim.claimId,
      propertyType: claim.propertyType,
      accessible: claim.accessible,
      dateOfSubsidence: claim.dateOfSubsidence,
      email: claim.email || 'joe.bloggs@defra.gov.uk'
    })
  }
}
