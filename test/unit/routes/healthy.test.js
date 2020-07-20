describe('Healthy test', () => {
  let server

  jest.mock('../../../server/services/message-service')
  jest.mock('../../../server/services/database-service')
  const databaseService = require('../../../server/services/database-service')
  const createServer = require('../../../server')

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

  test('GET /healthy returns 503 if database not connected', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    databaseService.isConnected.mockReturnValue(false)

    const response = await server.inject(options)

    expect(response.statusCode).toBe(503)
    expect(response.payload).toBe('database unavailable')
  })

  test('GET /healthy returns 503 and error message if database check throws an error', async () => {
    const options = {
      method: 'GET',
      url: '/healthy'
    }

    const errorMessage = 'database connection timeout'
    databaseService.isConnected.mockImplementation(() => { throw new Error(errorMessage) })

    const response = await server.inject(options)

    expect(response.statusCode).toBe(503)
    expect(response.payload).toBe(`error running healthy check: ${errorMessage}`)
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })
})
