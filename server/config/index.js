const joi = require('joi')
const mqConfig = require('./mq-config')
const databaseConfig = require('./database-config')

const schema = {
  env: joi.string().valid('development', 'test', 'production').default('development'),
  port: joi.number().default(3003)
}

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT
}

const result = joi.validate(config, schema, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

const value = {
  ...result.value,
  database: databaseConfig,
  messageQueues: mqConfig,
  isDev: result.value.env === 'development',
  isProd: result.value.env === 'production'
}

module.exports = value
