describe('Core config', () => {
  jest.mock('../../server/config/mq-config', () => ({}))

  test('throws error for invalid port', async () => {
    let caughtError

    process.env.PORT = 'invalid'

    try {
      require('../../server/config')
    } catch (error) {
      caughtError = error
    }

    expect(caughtError.message).toBe(
      'The server config is invalid. "port" must be a number'
    )
  })
})
