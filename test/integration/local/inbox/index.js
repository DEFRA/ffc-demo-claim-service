const inbox = require('../../../../app/messaging/inbox')

describe('inbox service', () => {
  afterAll(async () => {
    await inbox.stop()
  })

  test('runs', async () => {
    await inbox.start()
  })
})
