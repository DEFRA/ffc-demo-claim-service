const { models } = require('../services/database-service')

module.exports = {
  create: async function (claimId, mineType) {
    return models.mineTypes.upsert({
      claimId: claimId,
      mineType: mineType
    })
  }
}
