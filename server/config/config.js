const config = {
  production: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: 'mine_claims',
    host: 'mine-support-postgres-claims',
    port: 5432,
    dialect: 'postgres'
  },
  development: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: 'mine_claims',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: 'mine_claims',
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
  }
}

module.exports = config
