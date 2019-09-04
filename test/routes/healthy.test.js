describe('Healthy test', () => {
  let createServer
  let databaseService
  let messageService
  let server

  beforeAll(async () => {
    jest.mock('../../server/services/database-service')
    jest.mock('../../server/services/message-service')
    databaseService = require('../../server/services/database-service')
    messageService = require('../../server/services/message-service')
    createServer = require('../../server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /healthy returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(true)
    messageService.isConnected = jest.fn().mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /healthy returns 500 if database not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(false)
    messageService.isConnected = jest.fn().mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
    expect(response.payload).toBe('Downstream services unavailable: database')
  })

  test('GET /healthy returns 500 if message queue not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(true)
    messageService.isConnected = jest.fn().mockReturnValue(false)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
    expect(response.payload).toBe('Downstream services unavailable: message queue')
  })

  test('GET /healthy returns appropriate error message if all downstream services not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(false)
    messageService.isConnected = jest.fn().mockReturnValue(false)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
    expect(response.payload).toBe('Downstream services unavailable: database, message queue')
  })

  afterEach(async () => {
    await server.stop()
  })
})
