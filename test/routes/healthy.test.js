describe('Healthy test', () => {
  const calculationSender = {}
  let createServer
  let databaseService
  let messageService
  const scheduleSender = {}
  let server

  beforeAll(async () => {
    jest.mock('../../server/services/database-service')
    jest.mock('../../server/services/message-service')

    databaseService = require('../../server/services/database-service')
    messageService = require('../../server/services/message-service')

    messageService.getCalculationSender = jest.fn().mockReturnValue(calculationSender)
    messageService.getScheduleSender = jest.fn().mockReturnValue(scheduleSender)

    calculationSender.isConnected = jest.fn().mockReturnValue(false)
    scheduleSender.isConnected = jest.fn().mockReturnValue(false)

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
    calculationSender.isConnected = jest.fn().mockReturnValue(true)
    scheduleSender.isConnected = jest.fn().mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /healthy returns 500 if database not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(false)
    calculationSender.isConnected = jest.fn().mockReturnValue(true)
    scheduleSender.isConnected = jest.fn().mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(503)
    expect(response.payload).toBe('database unavailable')
  })

  test('GET /healthy returns 503 if calculation queue not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(true)
    calculationSender.isConnected = jest.fn().mockReturnValue(false)
    scheduleSender.isConnected = jest.fn().mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ok')
  })

  test('GET /healthy returns 503 if schedule queue not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(true)
    calculationSender.isConnected = jest.fn().mockReturnValue(true)
    scheduleSender.isConnected = jest.fn().mockReturnValue(false)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ok')
  })

  test('GET /healthy returns 503 with appropriate message if all downstream services are disconnected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected = jest.fn().mockReturnValue(false)
    calculationSender.isConnected = jest.fn().mockReturnValue(false)
    scheduleSender.isConnected = jest.fn().mockReturnValue(false)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(503)
    expect(response.payload).toBe('database unavailable')
  })

  afterEach(async () => {
    await server.stop()
  })
})
