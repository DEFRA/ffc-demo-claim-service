const { models, sequelize } = require('../../services/database-service')()

async function createClaim (claim) {
  await sequelize.transaction(async (transaction) => {
    const existingClaim = await models.claims.findOne({ where: { claimId: claim.claimId } }, { transaction })
    if (!existingClaim) {
      await models.claims.create(claim, transaction)
      await models.outbox.create({ claimId: claim.claimId, published: false }, { transaction })
      for (const mineType of claim.mineType) {
        await models.mineTypes.create({ claimId: claim.claimId, mineType }, { transaction })
      }
      console.info(`Saved claim: ${claim.claimId}`)
    }
  })
}

module.exports = createClaim
