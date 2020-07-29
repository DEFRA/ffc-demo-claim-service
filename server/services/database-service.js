const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = (async function () {
  const databaseConfig = config.database[config.env]
  return new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig)
}())

module.exports = sequelize
