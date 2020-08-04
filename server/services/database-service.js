const Sequelize = require('sequelize')
const config = require('../config')

const databaseConfig = config.database[config.env]

module.exports = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig)
