const { models, sequelize } = require('./database-service')()

async function createClaim (message) {
  try {
    const claim = message.body
    console.log(claim)
    await sequelize.transaction(async (transaction) => {
      const existingClaim = await models.claims.findOne({ where: { claimId: claim.claimId }, transaction })
      if (!existingClaim) {
        await models.claims.create(claim, { transaction })
        await models.outbox.create({ claimId: claim.claimId, published: false }, transaction)
        for (const mineType of claim.mineType) {
          await models.mineTypes.create({ claimId: claim.claimId, mineType }, transaction)
        }
        console.info(`Saved claim: ${claim.claimId}`)
      }
    })
    await message.complete()
  } catch (err) {
    console.error('Unable to process message:', err)
    await message.abandon()
  }
}

module.exports = createClaim
