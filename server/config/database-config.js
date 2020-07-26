const auth = require('@azure/ms-rest-nodeauth')

const dbConfig = {
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'mine_claims',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  dialect: 'postgres',
  hooks: {
    beforeConnect: async (cfg) => {
      console.log('*******************beforeConnect config', cfg)
      if (cfg.username !== 'postgres') {
        console.log('attempting to acquire MSI credentials')
        const credentials = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
        console.log('credentials', credentials)
        const token = await credentials.getToken()
        console.log('token', token)
        cfg.password = token.accessToken
      }
      console.log('*******************beforeConnect config', cfg)
    }
  //   afterConnect: (conn, cfg) => {
  //     console.log('*******************afterConnect config', cfg)
  //     console.log('*******************afterConnect connection', conn)
  //   },
  //   beforeDisconnect: (conn) => {
  //     console.log('*******************beforeDisconnect connection', conn)
  //   },
  //   afterDisconnect: (conn) => {
  //     console.log('*******************afterDisconnect connection', conn)
  //   }
  // },
  // retry: {
  //   match: [/SequelizeConnectionError/],
  //   max: 20
  }
}

const config = {
  production: dbConfig,
  development: dbConfig,
  test: dbConfig
}

module.exports = config
