const createMessageService = require('../../../app/services/inbox-service')
const { messageQueues } = require('../../../app/config')

jest.mock('../../../app/services/messaging/message-receiver')
jest.mock('../../../app/services/messaging/message-sender')

describe('Test message service', () => {
  let MessageSender
  let MessageReceiver
  let messageService

  beforeAll(async () => {
    messageService = await createMessageService()
    await messageService.closeConnections()
    MessageReceiver = require('../../../app/services/messaging/message-receiver')
    MessageSender = require('../../../app/services/messaging/message-sender')
  })

  test('Message service should create two senders and one receiver', async () => {
    expect(MessageSender).toHaveBeenCalledTimes(2)
    expect(MessageReceiver).toHaveBeenCalledTimes(1)
    expect(MessageReceiver).toHaveBeenCalledWith('claim-service-claim-receiver', messageQueues.claimQueue, undefined, expect.any(Function))
    expect(MessageSender).toHaveBeenNthCalledWith(1, 'claim-service-calculation-sender', messageQueues.calculationQueue, undefined)
    expect(MessageSender).toHaveBeenNthCalledWith(2, 'claim-service-schedule-sender', messageQueues.scheduleQueue, undefined)
  })
})
