const joi = require('@hapi/joi')

const queueSchema = joi.object({
  address: joi.string().required()
})

const mqSchema = joi.object({
  host: joi.string().default('localhost'),
  username: joi.string().required(),
  password: joi.string().required(),
  calculationQueue: queueSchema,
  claimQueue: queueSchema,
  scheduleQueue: queueSchema
})

const mqConfig = {
  host: process.env.MESSAGE_QUEUE_HOST,
  username: process.env.MESSAGE_QUEUE_USER,
  password: process.env.MESSAGE_QUEUE_PASSWORD,
  calculationQueue: {
    address: process.env.CALCULATION_QUEUE_ADDRESS
  },
  scheduleQueue: {
    address: process.env.SCHEDULE_QUEUE_ADDRESS
  },
  claimQueue: {
    address: process.env.CLAIM_QUEUE_ADDRESS
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

module.exports = mqResult.value
