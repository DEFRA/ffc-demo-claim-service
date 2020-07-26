const auth = require('@azure/ms-rest-nodeauth')
const Sequelize = require('sequelize')
const config = require('../config')

module.exports = (async function () {
  const databaseConfig = config.database[config.env]
  let password
  if (config.isProd) {
    const credentials = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
    const token = await credentials.getToken()
    password = token.accessToken
  } else {
    password = databaseConfig.password
  }
  const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, password, databaseConfig)
  console.log(sequelize)
  return sequelize
}())
