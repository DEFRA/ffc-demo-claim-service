describe('Healthy test', () => {
  let server

  jest.mock('../../server/services/message-service')
  jest.mock('../../server/services/database-service')
  const databaseService = require('../../server/services/database-service')
  const createServer = require('../../server')

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /healthy returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected.mockReturnValue(true)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /healthy returns 500 if database not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected.mockReturnValue(false)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(503)
    expect(response.payload).toBe('database unavailable')
  })

  afterEach(async () => {
    await server.stop()
  })
})
