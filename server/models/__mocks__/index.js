const db = {}

jest.mock('sequelize', () => {
  return require('sequelize-mock')
})

const claim = require('../claim')
const minetype = require('../minetype')

db[claim.name] = claim
db[minetype.name] = minetype

module.exports = db
