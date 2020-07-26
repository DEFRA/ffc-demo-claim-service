const claimRepository = require('../repository/claim-repository')
const mineTypeRepository = require('../repository/minetype-repository')

module.exports = {
  create: async function (claim, publisher) {
    const existingClaim = await claimRepository.getById(claim.claimId)
    console.log('existingClaim', existingClaim)
    if (existingClaim != null) {
      console.log('Found existing claim ', existingClaim)
      return existingClaim
    }

    console.log('Creating new claim ', claim)
    const claimRecord = await claimRepository.create(claim)

    if (claim.mineType != null) {
      for (const mineType of claim.mineType) {
        await mineTypeRepository.create(claim.claimId, mineType)
      }
    }

    await publisher(claim)

    return claimRecord
  }
}
