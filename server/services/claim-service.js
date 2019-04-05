const claimRepository = require('../repository/claim-repository')
const mineTypeRepository = require('../repository/minetype-repository')
const messageService = require('../services/message-service')

module.exports = {
  create: async function (claim) {
    console.log(claim)
    const existingClaim = await claimRepository.getById(claim.claimId)
    if (existingClaim != null) {
      console.log('existing claim, no action required')
      return existingClaim
    }

    const claimRecord = await claimRepository.create(claim)

    if (claim.mineType != null) {
      claim.mineType.forEach(type => {
        mineTypeRepository.create(claim.claimId, type)
      })
    }

    messageService.publishClaim(claim)

    return claimRecord
  }
}
