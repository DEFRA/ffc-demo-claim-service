const fs = require('fs')
const path = require('path')
const sequelize = require('../services/database-service')
const basename = path.basename(__filename)

module.exports = (async function () {
  const models = {}
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(file => {
      const model = sequelize.import(path.join(__dirname, file))
      if (model && model.name) {
        models[model.name] = model
      }
    })
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
  })
  models.sequelize = sequelize
  return models
}())
