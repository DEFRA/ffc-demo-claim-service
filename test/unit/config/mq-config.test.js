describe('Message queue config', () => {
  test('throws error for invalid port', async () => {
    let caughtError

    process.env.MESSAGE_QUEUE_PORT = 'invalid'

    try {
      require('../../../server/config/mq-config')
    } catch (error) {
      caughtError = error
    }

    expect(caughtError.message).toBe(
      'The message queue config is invalid. "messageQueue.port" must be a number'
    )
  })
})
