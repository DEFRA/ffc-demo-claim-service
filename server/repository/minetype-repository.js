const db = require('../models')

module.exports = {
  create: async function (claimId, mineType) {
    return (await db).mineTypes.upsert({
      claimId: claimId,
      mineType: mineType
    })
  }
}
