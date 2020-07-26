const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = (async function () {
  const databaseConfig = config.database[config.env]
  const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig)
  console.log(sequelize)
  return sequelize
}())

module.exports = sequelize
