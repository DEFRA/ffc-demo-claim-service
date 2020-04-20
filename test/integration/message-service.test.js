const messageService = require('../../server/services/message-service')

describe('message service', () => {
  afterEach(async () => {
    await messageService.closeConnections()
  })
  test('smoke test', async () => {
    await messageService.registerService()
    await messageService.closeConnections()
  })
})
