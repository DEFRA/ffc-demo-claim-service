const dbConfig = require('../../../app/config/database-config')
const { production } = require('../../../app/config/constants').environments
const { DefaultAzureCredential } = require('@azure/identity')

jest.mock('@azure/identity')

describe('database config', () => {
  beforeEach(() => {
    process.env.NODE_ENV = production
    process.env.POSTGRES_PASSWORD = 'test'
    process.env.POSTGRES_USERNAME = 'test'
    process.env.AZURE_CLIENT_ID = 'test-client-id'

    const mockToken = { token: 'test' }
    DefaultAzureCredential.mockImplementation(() => {
      return {
        getToken: jest.fn().mockResolvedValue(mockToken)
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('valid access token generated for production', async () => {
    const cfg = { password: '' }
    await dbConfig.production.hooks.beforeConnect(cfg)
    expect(cfg.password).toBe('test')
  })

  test('valid database config export for development', () => {
    expect(dbConfig.development).toBeDefined()
  })

  test('valid database config export for production', () => {
    expect(dbConfig.production).toBeDefined()
  })

  test('valid database config export for test', () => {
    expect(dbConfig.test).toBeDefined()
  })
})
