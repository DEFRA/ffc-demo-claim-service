const claimRepository = require('../repository/claim-repository')
const mineTypeRepository = require('../repository/minetype-repository')

module.exports = {
  create: async function (claim) {
    console.log(claim)
    let existingClaim = await claimRepository.getById(claim.claimId)
    if (existingClaim != null) {
      console.log('existing claim, no action required')
      return existingClaim
    }

    let claimRecord = claimRepository.create(claim)

    if (claim.mineType != null) {
      claim.mineType.forEach(type => {
        mineTypeRepository.create(claim.claimId, type)
      })
    }
    return claimRecord
  }
}
