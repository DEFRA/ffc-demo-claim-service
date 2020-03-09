const joi = require('@hapi/joi')

const queueSchema = joi.object({
  name: joi.string().required(),
  endpoint: joi.string().required(),
  queueUrl: joi.string().required(),
  region: joi.string().default('eu-west-2'),
  accessKeyId: joi.string().optional(),
  secretAccessKey: joi.string().optional(),
  createQueue: joi.bool().default(true)
})

const mqSchema = joi.object({
  calculationQueue: queueSchema,
  scheduleQueue: queueSchema
})

const mqConfig = {
  calculationQueue: {
    name: process.env.CALCULATION_QUEUE_NAME,
    endpoint: process.env.CALCULATION_ENDPOINT,
    queueUrl: process.env.CALCULATION_QUEUE_URL,
    accessKeyId: process.env.DEV_ACCESS_KEY_ID,
    secretAccessKey: process.env.DEV_ACCESS_KEY,
    region: process.env.CALCULATION_QUEUE_REGION,
    createQueue: process.env.CREATE_CALCULATION_QUEUE
  },
  scheduleQueue: {
    name: process.env.SCHEDULE_QUEUE_NAME,
    endpoint: process.env.SCHEDULE_ENDPOINT,
    queueUrl: process.env.SCHEDULE_QUEUE_URL,
    region: process.env.SCHEDULE_QUEUE_REGION,
    accessKeyId: process.env.DEV_ACCESS_KEY_ID,
    secretAccessKey: process.env.DEV_ACCESS_KEY,
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

const calculationQueueConfig = mqResult.value.calculationQueue
const scheduleQueueConfig = mqResult.value.scheduleQueue

module.exports = {
  calculationQueueConfig,
  scheduleQueueConfig
}
