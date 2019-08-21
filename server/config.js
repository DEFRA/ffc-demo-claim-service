const joi = require('joi')
const mqConfig = require('./config/mq-config')

// Define config schema
const schema = {
  env: joi.string().valid('development', 'test', 'production').default('development'),
  port: joi.number().default(3003)
}

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT
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
const value = {
  ...result.value,
  ...mqConfig
}

// Add some helper props
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

module.exports = value
