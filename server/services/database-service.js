const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config')
const dbConfig = config.database[config.env]
const modelPath = path.join(__dirname, '..', 'models')

module.exports = () => {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)

  fs
    .readdirSync(modelPath)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js')
    })
    .forEach(file => require(path.join(modelPath, file))(sequelize, DataTypes))

  for (const model of Object.values(sequelize.models)) {
    if (model.associate) {
      model.associate(sequelize.models)
    }
  }

  return {
    models: sequelize.models,
    sequelize
  }
}
