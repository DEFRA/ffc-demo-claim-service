const joi = require('joi')

const queueSchema = joi.object({
  address: joi.string().required(),
  username: joi.string().optional(),
  password: joi.string().optional(),
  type: joi.string().optional()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    usePodIdentity: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
  },
  calculationQueue: queueSchema,
  claimQueue: queueSchema,
  scheduleTopic: queueSchema
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    usePodIdentity: process.env.NODE_ENV === 'production',
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  calculationQueue: {
    address: process.env.CALCULATION_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  scheduleTopic: {
    address: process.env.SCHEDULE_TOPIC_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    type: 'topic'
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
const scheduleTopic = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.scheduleTopic
}

module.exports = {
  calculationQueue,
  claimQueue,
  scheduleTopic
}
