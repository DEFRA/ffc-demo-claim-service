describe('Web test', () => {
  let createServer
  let server
  let mockClaimRepository

  beforeAll(async () => {
    jest.mock('../server/repository/claim-repository')
    jest.mock('../server/repository/minetype-repository')
    jest.mock('../server/services/message-service')
    createServer = require('../server')
    mockClaimRepository = require('../server/repository/claim-repository')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
    mockClaimRepository.create.mockClear()
  })

  test('GET / route returns 404', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect((response.headers['content-type'])).toEqual(expect.stringContaining('application/json'))
  })

  test('GET / route returns 404 for dev mode', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }
    jest.mock('../server/config', () => {
      return {
        isDev: true,
        port: 80
      }
    })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
    expect((response.headers['content-type'])).toEqual(expect.stringContaining('application/json'))
    jest.unmock('../server/config')
  })

  test('POST /submit route works with valid content', async () => {
    const options = {
      method: 'POST',
      url: '/submit',
      payload: {
        claimId: 'MINE123',
        propertyType: 'business',
        accessible: false,
        dateOfSubsidence: new Date(),
        mineType: ['gold', 'iron']
      }
    }

    const response = await server.inject(options)
    expect(mockClaimRepository.create).toHaveBeenCalledTimes(1)
    expect(response.statusCode).toBe(200)
  })

  test('POST /submit route fails with invalid content', async () => {
    const options = {
      method: 'POST',
      url: '/submit',
      payload: { }
    }

    const response = await server.inject(options)
    expect(mockClaimRepository.create).toHaveBeenCalledTimes(0)
    expect(response.statusCode).toBe(400)
  })

  test('GET /error route returns 500', async () => {
    const options = {
      method: 'GET',
      url: '/error'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })

  afterAll(async () => {
    jest.unmock('../server/repository/claim-repository')
    jest.unmock('../server/repository/minetype-repository')
    jest.unmock('../server/services/message-service')
  })

  afterEach(async () => {
    await server.stop()
  })
})
