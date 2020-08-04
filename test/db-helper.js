let models = require('../server/models')

async function truncate () {
  models = await models
  models.claims.destroy({ truncate: { casecade: true } })
  models.mineTypes.destroy({ truncate: true })
}

async function createClaimRecords (claims) {
  models.claims.bulkCreate(claims)
}

async function createMineTypeRecords (mineTypes) {
  models.mineTypes.bulkCreate(mineTypes)
}

async function close () {
  models.sequelize.close()
}

module.exports = {
  close,
  createClaimRecords,
  createMineTypeRecords,
  truncate
}
