jest.mock('notifications-node-client')
const outbox = require('../../../../app/messaging/outbox')

describe('outbox service', () => {
  afterAll(async () => {
    await outbox.stop()
  })

  test('runs', async () => {
    await outbox.start()
  })
})
