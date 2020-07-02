const joi = require('@hapi/joi')
const mqConfig = require('./mq-config')
const databaseConfig = require('./database-config')

async function getValue () {
  const schema = joi.object({
    env: joi.string().valid('development', 'test', 'production').default('development'),
    port: joi.number().default(3003)
  })

  const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT
  }

  const result = schema.validate(config, {
    abortEarly: false
  })

  if (result.error) {
    throw new Error(`The server config is invalid. ${result.error.message}`)
  }

  await databaseConfig()
  const value = {
    ...result.value,
    database: databaseConfig,
    messageQueues: mqConfig,
    isDev: result.value.env === 'development',
    isProd: result.value.env === 'production'
  }

  return value
}

module.exports = getValue
