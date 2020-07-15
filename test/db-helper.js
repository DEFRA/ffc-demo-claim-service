const db = require('../server/models')

async function truncate () {
  await db.claims.destroy({ truncate: { casecade: true } })
  await db.mineTypes.destroy({ truncate: true })
}

async function createClaimRecords (claims) {
  await db.claims.bulkCreate(claims)
}
async function createMineTypeRecords (mineTypes) {
  await db.mineTypes.bulkCreate(mineTypes)
}

async function close () {
  await db.sequelize.close()
}

module.exports = {
  close,
  createClaimRecords,
  createMineTypeRecords,
  truncate
}
