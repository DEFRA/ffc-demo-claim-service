const joi = require('@hapi/joi')

const mqSchema = joi.object({

  calculationQueue: {
    name: joi.string().default('calculation'),
    endpoint: joi.string().default('http://localhost:9324'),
    queueUrl: joi.string().default('http://localhost:9324/queue/calculation'),
    region: joi.string().default('eu-west-2'),
    accessKeyId: joi.string(),
    secretAccessKey: joi.string(),
    createQueue: joi.bool().default(true)
  },
  scheduleQueue: {
    name: joi.string().default('schedule'),
    endpoint: joi.string().default('http://localhost:9324'),
    queueUrl: joi.string().default('http://localhost:9324/queue/schedule'),
    region: joi.string().default('eu-west-2'),
    accessKeyId: joi.string(),
    secretAccessKey: joi.string(),
    createQueue: joi.bool().default(true)
  }
})

const mqConfig = {
  calculationQueue: {
    name: process.env.CALCULATION_QUEUE_NAME,
    endpoint: process.env.CALCULATION_ENDPOINT,
    queueUrl: process.env.CALCULATION_QUEUE_URL,
    region: process.env.CALCULATION_QUEUE_REGION,
    accessKeyId: process.env.CALCULATION_QUEUE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CALCULATION_QUEUE_ACCESS_KEY,
    createQueue: process.env.CREATE_CALCULATION_QUEUE
  },
  scheduleQueue: {
    name: process.env.SCHEDULE_QUEUE_NAME,
    endpoint: process.env.SCHEDULE_ENDPOINT,
    queueUrl: process.env.SCHEDULE_QUEUE_URL,
    region: process.env.SCHEDULE_QUEUE_REGION,
    accessKeyId: process.env.SCHEDULE_QUEUE_ACCESS_KEY_ID,
    secretAccessKey: process.env.SCHEDULE_QUEUE_ACCESS_KEY,
    createQueue: process.env.CREATE_SCHEDULE_QUEUE
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const calculationQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.calculationQueue }
const scheduleQueueConfig = { ...mqResult.value.messageQueue, ...mqResult.value.scheduleQueue }

module.exports = {
  calculationQueueConfig: calculationQueueConfig,
  scheduleQueueConfig: scheduleQueueConfig
}
