const auth = require('@azure/ms-rest-nodeauth')

function logRetry (message) {
  console.log(message)
}

const dbConfig = {
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'mine_claims',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  dialect: 'postgres',
  hooks: {
    beforeConnect: async (cfg) => {
      console.log('running beforeConnect hook', cfg)
      if (cfg.username !== 'postgres') {
        console.log('attempting to acquire MSI credentials')
        const credentials = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
        console.log('credentials', credentials)
        const token = await credentials.getToken()
        console.log('token', token)
        cfg.password = token.accessToken
      }
    }
  },
  retry: {
    backoffBase: 500,
    backoffExponent: 1.1,
    match: [/SequelizeConnectionError/],
    max: 10,
    name: 'SequelizeConnectionError',
    report: logRetry,
    timeout: 60000
  }
}

const config = {
  production: dbConfig,
  development: dbConfig,
  test: dbConfig
}

module.exports = config
