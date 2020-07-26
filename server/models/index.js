const fs = require('fs')
const path = require('path')
const sequelize = require('../services/database-service')
const basename = path.basename(__filename)

module.exports = (async function () {
  const seq = await sequelize
  const db = {}
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(async file => {
      const model = seq.import(path.join(__dirname, file))
      db[model.name] = model
    })

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
  return db
}())
