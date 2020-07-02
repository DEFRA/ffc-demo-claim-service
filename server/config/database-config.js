const auth = require('@azure/ms-rest-nodeauth')

async function getPostgresCreds () {
  const creds = await auth.loginWithVmMSI({ clientId: process.env.CLIENT_ID, resource: 'https://ossrdbms-aad.database.windows.net' })
  const token = await creds.getToken()
  console.log(`Postges token: ${token.accessToken}`)
  return token.accessToken
}

const dbConfig = {
  username: process.env.POSTGRES_USERNAME,
  password: getPostgresCreds(),
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

module.exports = config
