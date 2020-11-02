const joi = require('joi')

const queueSchema = joi.object({
  address: joi.string().required(),
  username: joi.string().optional(),
  password: joi.string().optional()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    usePodIdentity: joi.bool().default(false)
  },
  calculationQueue: queueSchema,
  claimQueue: queueSchema,
  scheduleQueue: queueSchema
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    usePodIdentity: process.env.NODE_ENV === 'production',
    type: 'queue'
  },
  calculationQueue: {
    address: process.env.CALCULATION_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  scheduleQueue: {
    address: process.env.SCHEDULE_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  claimQueue: {
    address: process.env.CLAIM_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const calculationQueue = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.calculationQueue
}
const claimQueue = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.claimQueue
}
const scheduleQueue = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.scheduleQueue
}

module.exports = {
  calculationQueue,
  claimQueue,
  scheduleQueue
}
