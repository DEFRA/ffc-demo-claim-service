const claimRepository = require('../repository/claim-repository')
const mineTypeRepository = require('../repository/minetype-repository')
const messageService = require('./message-service')

module.exports = {
  create: async function (claim) {
    const existingClaim = await claimRepository.getById(claim.claimId)
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

    await messageService.publishClaim(claim)

    return claimRecord
  }
}
