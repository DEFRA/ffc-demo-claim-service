describe('Web test', () => {
  let createServer = require('../server')

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
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

  afterEach(async () => {
    await server.stop()
  })
})
