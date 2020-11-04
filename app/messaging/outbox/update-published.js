const { models } = require('../../services/database-service')()

async function updatePublished (claimId) {
  await models.outbox.update({ published: true }, { where: { claimId } })
  console.info(`Published claim: ${claimId}`)
}

module.exports = updatePublished
