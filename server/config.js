const joi = require('joi')
const mqConfig = require('./mq-config')

// Define config schema
const schema = {
  port: joi.number().default(3003),
  env: joi.string().valid('development', 'test', 'production').default('development'),
  messageQueue: {
    address: joi.string().default('mine-support-artemis'),
    transport: joi.string().default('tcp'),
    user: joi.string(),
    pass: joi.string(),
    port: joi.number().default(5672)
  }
}

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV
}

// Validate config
const result = joi.validate(config, schema, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

value.scheduleQueueConfig = mqConfig.scheduleQueueConfig
value.calculationQueueConfig = mqConfig.calculationQueueConfig

module.exports = value
