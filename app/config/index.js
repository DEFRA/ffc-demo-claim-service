const joi = require('joi')
const mqConfig = require('./mq-config')
const databaseConfig = require('./database-config')
const { environments } = require('./constants')

const schema = joi.object({
  env: joi.string().valid(environments.development, environments.test, environments.production).default(environments.development),
  publishPollingInterval: joi.number().default(5000),
  notifyApiKey: joi.string().allow(''),
  notifyEmailTemplateKey: joi.string().allow('')
})

const config = {
  env: process.env.NODE_ENV,
  publishPollingInterval: process.env.PUBLISH_POLLING_INTERVAL,
  notifyApiKey: process.env.NOTIFY_API_KEY,
  notifyEmailTemplateKey: process.env.NOTIFY_EMAIL_TEMPLATE_KEY
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
