const joi = require('@hapi/joi')

const mqSchema = {
  messageQueue: {
    host: joi.string().default('localhost'),
    hostname: joi.string().default('localhost'),
    port: joi.number().default(5672),
    reconnect_Limit: joi.number().default(10),
    transport: joi.string().default('tcp')
  },
  calculationQueue: {
    address: joi.string().default('calculation'),
    username: joi.string(),
    password: joi.string()
  },
  scheduleQueue: {
    address: joi.string().default('schedule'),
    username: joi.string(),
    password: joi.string(),
    sendTimeoutInSeconds: joi.number().default(10)
  }
}

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    hostname: process.env.MESSAGE_QUEUE_HOST,
    port: process.env.MESSAGE_QUEUE_PORT,
    reconnect_Limit: process.env.MESSAGE_QUEUE_RECONNECT_LIMIT,
    transport: process.env.MESSAGE_QUEUE_TRANSPORT
  },
  calculationQueue: {
    address: process.env.CALCULATION_QUEUE_ADDRESS,
    username: process.env.CALCULATION_QUEUE_USER,
    password: process.env.CALCULATION_QUEUE_PASSWORD
  },
  scheduleQueue: {
    address: process.env.SCHEDULE_QUEUE_ADDRESS,
    username: process.env.SCHEDULE_QUEUE_USER,
    password: process.env.SCHEDULE_QUEUE_PASSWORD,
    sendTimeoutInSeconds: process.env.SEND_TIMEOUT_IN_SECONDS
  }
}

const mqResult = joi.validate(mqConfig, mqSchema, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const calculationQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.calculationQueue }
const scheduleQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.scheduleQueue }

module.exports = {
  calculationQueue: calculationQueueConfig,
  scheduleQueue: scheduleQueueConfig
}
