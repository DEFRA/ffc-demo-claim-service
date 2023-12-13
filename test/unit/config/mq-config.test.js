const joi = require('joi')
jest.mock('joi')

describe('Test mqSchema validation', () => {
  beforeEach(() => {
    joi.object.mockClear()
  })

  test('should return valid config', () => {
    joi.string = jest.fn().mockImplementation(() => {
      return {
        required: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        default: jest.fn().mockReturnThis()
      }
    })

    joi.bool = jest.fn().mockImplementation(() => {
      return {
        default: jest.fn().mockReturnValue(false)
      }
    })

    joi.object.mockReturnValue({
      validate: () => ({
        value: {
          messageQueue: {
            host: process.env.MESSAGE_QUEUE_HOST,
            useCredentialChain: process.env.NODE_ENV === 'production',
            managedIdentityClientId: process.env.AZURE_CLIENT_ID,
            type: 'queue',
            appInsights:
              process.env.NODE_ENV === 'production'
                ? require('applicationinsights')
                : undefined
          },
          calculationQueue: {
            name:
              process.env.CALCULATION_QUEUE_NAME ||
              'ffc-demo-claim-service-calculation',
            address: process.env.CALCULATION_QUEUE_ADDRESS,
            username: process.env.MESSAGE_QUEUE_USER,
            password: process.env.MESSAGE_QUEUE_PASSWORD
          },
          scheduleTopic: {
            name:
              process.env.SCHEDULE_TOPIC_NAME ||
              'ffc-demo-claim-service-schedule',
            address: process.env.SCHEDULE_TOPIC_ADDRESS,
            username: process.env.MESSAGE_QUEUE_USER,
            password: process.env.MESSAGE_QUEUE_PASSWORD,
            type: 'topic'
          },
          claimQueue: {
            name:
              process.env.CALCULATION_QUEUE_NAME ||
              'ffc-demo-claim-service-claim',
            address: process.env.CLAIM_QUEUE_ADDRESS,
            username: process.env.MESSAGE_QUEUE_USER,
            password: process.env.MESSAGE_QUEUE_PASSWORD
          }
        },
        error: null
      })
    })

    const {
      calculationQueue,
      claimQueue,
      scheduleTopic
    } = require('../../../app/config/mq-config')

    expect(calculationQueue).toBeDefined()
    expect(claimQueue).toBeDefined()
    expect(scheduleTopic).toBeDefined()
  })
})
