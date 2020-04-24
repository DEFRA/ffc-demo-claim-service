const messageService = require('../../server/services/message-service')

describe('message service', () => {
  afterEach(() => {
    messageService.closeConnections()
  })
  test('smoke test', async () => {
    await messageService.registerService()
    messageService.closeConnections()
  })
})
