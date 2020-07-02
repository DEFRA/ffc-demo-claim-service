const auth = require('@azure/ms-rest-nodeauth')

async function getConfig () {
  const creds = await auth.loginWithVmMSI({ clientId: process.env.CLIENT_ID, resource: 'https://ossrdbms-aad.database.windows.net' })
  const token = await creds.getToken()

  const dbConfig = {
    username: process.env.POSTGRES_USERNAME,
    password: token.accessToken,
    database: process.env.POSTGRES_DB || 'mine_claims',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres'
  }

  const config = {
    production: dbConfig,
    development: dbConfig,
    test: dbConfig
  }

  return config
}

module.exports = getConfig
