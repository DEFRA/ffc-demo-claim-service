const fs = require('fs')
require('path')
const { Sequelize } = require('sequelize')
require('../../../app/config')
jest.mock('fs')
jest.mock('sequelize')
jest.mock('../../../app/config', () => {
  return {
    env: 'test',
    publishPollingInterval: 5000,
    notifyApiKey: 'test',
    notifyEmailTemplateKey: 'test',
    messageQueues: {
      claimQueue: {
        name: 'test-queue',
        address: 'address',
        username: 'username',
        password: 'password',
        type: 'queue',
        host: 'localhost',
        useCredentialChain: false,
        managedIdentityClientId: 'asdf',
        appInsights: undefined
      },
      calculationQueue: {
        name: 'test-queue',
        address: 'address',
        username: 'username',
        password: 'password',
        type: 'queue',
        host: 'localhost',
        useCredentialChain: false,
        managedIdentityClientId: 'asdf',
        appInsights: undefined
      },
      scheduleTopic: {
        name: 'test-topic',
        address: 'address',
        username: 'username',
        password: 'password',
        type: 'topic',
        host: 'localhost',
        useCredentialChain: false,
        managedIdentityClientId: 'asdf',
        appInsights: undefined
      }
    },
    database: {
      development: {
        database: 'ffc_demo_claim_service',
        dialect: 'postgres',
        dialectOptions: {
          ssl: false
        },
        hooks: {
          beforeConnect: jest.fn()
        },
        host: 'ffc-demo-claim-service-postgres',
        password: 'POSTGRES_PASSWORD',
        port: 5432,
        logging: false,
        retry: {
          backoffBase: 500,
          backoffExponent: 1.1,
          match: [/SequelizeConnectionError/],
          max: 10,
          name: 'connection',
          timeout: 60000
        },
        schema: 'public',
        username: 'POSTGRES_USERNAME'
      },
      production: {
        database: 'ffc_demo_claim_service',
        dialect: 'postgres',
        dialectOptions: {
          ssl: false
        },
        hooks: {
          beforeConnect: jest.fn()
        },
        host: 'ffc-demo-claim-service-postgres',
        password: 'POSTGRES_PASSWORD',
        port: 5432,
        logging: false,
        retry: {
          backoffBase: 500,
          backoffExponent: 1.1,
          match: [/SequelizeConnectionError/],
          max: 10,
          name: 'connection',
          timeout: 60000
        },
        schema: 'public',
        username: 'POSTGRES_USERNAME'
      },
      test: {
        database: 'ffc_demo_claim_service',
        dialect: 'postgres',
        dialectOptions: {
          ssl: false
        },
        hooks: {
          beforeConnect: jest.fn()
        },
        host: 'ffc-demo-claim-service-postgres',
        password: 'POSTGRES_PASSWORD',
        port: 5432,
        logging: false,
        retry: {
          backoffBase: 500,
          backoffExponent: 1.1,
          match: [/SequelizeConnectionError/],
          max: 10,
          name: 'connection',
          timeout: 60000
        },
        schema: 'public',
        username: 'POSTGRES_USERNAME'
      }
    }
  }
})

describe('Database setup', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should call Sequelize constructor with correct arguments', () => {
    fs.readdirSync = jest.fn().mockReturnValue(['index.js'])
    require('../../../app/services/database-service')()
    expect(Sequelize).toHaveBeenCalled()
  })
})
