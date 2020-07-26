const auth = require('@azure/ms-rest-nodeauth')
const Sequelize = require('sequelize')
const config = require('../config')

const sequelize = (async function () {
  const databaseConfig = config.database[config.env]
  if (config.isProd) {
    console.log('config is for production. attempting to acquire MSI credentials')
    const credentials = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
    console.log('credentials', credentials)
    const token = await credentials.getToken()
    console.log('token', token)
    databaseConfig.password = token.accessToken
  }

  const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, databaseConfig)
  console.log(sequelize)
  return sequelize
}())

module.exports = sequelize
