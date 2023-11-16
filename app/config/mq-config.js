const joi = require('joi')

const queueSchema = joi.object({
  name: joi.string(),
  address: joi.string().required(),
  username: joi.string().optional(),
  password: joi.string().optional(),
  type: joi.string().optional()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    managedIdentityClientId: joi.string().optional(),
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
    useCredentialChain: process.env.NODE_ENV === 'production',
    managedIdentityClientId: process.env.AZURE_CLIENT_ID,
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  },
  calculationQueue: {
    name: process.env.CALCULATION_QUEUE_NAME || 'ffc-demo-claim-service-calculation',
    address: process.env.CALCULATION_QUEUE_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  scheduleTopic: {
    name: process.env.SCHEDULE_TOPIC_NAME || 'ffc-demo-claim-service-schedule',
    address: process.env.SCHEDULE_TOPIC_ADDRESS,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    type: 'topic'
  },
  claimQueue: {
    name: process.env.CALCULATION_QUEUE_NAME || 'ffc-demo-claim-service-claim',
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
