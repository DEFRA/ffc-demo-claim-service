const db = require('../models')

module.exports = {
  create: async function (claimId, mineType) {
    return db.mineTypes.upsert({
      claimId: claimId,
      mineType: mineType
    })
  }
}
