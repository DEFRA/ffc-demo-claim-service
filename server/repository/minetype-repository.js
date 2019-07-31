const db = require('../models')

module.exports = {
  create: async function (claimId, mineType) {
    try {
      let mineTypeRecord = await db.mineTypes.upsert({
        claimId: claimId,
        mineType: mineType
      })

      return mineTypeRecord
    } catch (err) {
      throw err
    }
  }
}
