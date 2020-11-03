const { models } = require('./database-service')()

async function createClaim (claim) {
  await models.sequelize.transaction(async (transaction) => {
    await models.outbox.upsert({ claimId: claim.claimId }, { transaction })
    await models.claims.upsert(claim, { transaction })
    for (const mineType of claim.mineType) {
      await models.mineTypes.upsert({ claimId: claim.claimId, mineType }, { transaction })
    }
  })
}

module.exports = createClaim
