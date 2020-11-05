const auth = require('@azure/ms-rest-nodeauth')
const { production } = require('./constants').environments

function isProd () {
  return process.env.NODE_ENV === production
}

const dbConfig = {
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  logging: process.env.POSTGRES_LOGGING || false,
  dialect: 'postgres',
  hooks: {
    beforeConnect: async (cfg) => {
      if (isProd()) {
        console.info('Attempting to acquire MSI credentials')
        const credentials = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
        console.info('Credentials acquired')
        const token = await credentials.getToken()
        console.info('Token acquired')
        cfg.password = token.accessToken
      }
    }
  },
  retry: {
    backoffBase: 500,
    backoffExponent: 1.1,
    match: [/SequelizeConnectionError/],
    max: 10,
    name: 'connection',
    timeout: 60000
  }
}

const config = {
  production: dbConfig,
  development: dbConfig,
  test: dbConfig
}

module.exports = config
