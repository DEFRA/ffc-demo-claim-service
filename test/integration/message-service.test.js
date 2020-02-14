const messageService = require('../../server/services/message-service')
describe('message service', () => {
  test('smoke test', async () => {
    await messageService.createQueuesIfRequired()
  })
})
