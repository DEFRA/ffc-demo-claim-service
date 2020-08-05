const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config')
const dbConfig = config.database[config.env]
const modelPath = path.join(__dirname, '..', 'models')

module.exports = (function () {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)
  const models = {}

  fs
    .readdirSync(modelPath)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js')
    })
    .forEach(file => {
      const model = sequelize.import(path.join(modelPath, file))
      if (model && model.name) {
        models[model.name] = model
      }
    })
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models)
    }
  })

  return {
    models,
    sequelize
  }
}())
