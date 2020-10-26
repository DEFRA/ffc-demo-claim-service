const joi = require('joi')
const mqConfig = require('./mq-config')
const databaseConfig = require('./database-config')
const { environments } = require('./constants')

const schema = joi.object({
  env: joi.string().valid(environments.development, environments.test, environments.production).default(environments.development)
})

const config = {
  env: process.env.NODE_ENV
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The config is invalid. ${result.error.message}`)
}

const value = {
  ...result.value,
  database: databaseConfig,
  messageQueues: mqConfig,
  isDev: result.value.env === environments.development,
  isProd: result.value.env === environments.production
}

module.exports = value
