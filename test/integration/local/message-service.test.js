const { mockSBClient, mockSend, ServiceBusClientMock } = require('../../unit/mocks/serviceBusMocks')

jest.mock('../../../server/config', () => ({
  messageQueues: {
    calculationQueue: 'calculationQueue',
    scheduleQueue: 'scheduleQueue',
    claimQueue: 'claimQueue'
  }
}))
jest.mock('../../../server/services/messaging/message-receiver')
jest.mock('../../../server/services/message-action', () => ({
  claimMessageAction: jest.fn()
}))
jest.mock('../../../server/services/claim-service')

const MessageReceiver = require('../../../server/services/messaging/message-receiver.js')
const { claimMessageAction } = require('../../../server/services/message-action')

describe('Test message service', () => {
  let messageService
  let messageReceiverInst

  beforeAll(() => {
    ServiceBusClientMock.createFromConnectionString.mockImplementation(() => mockSBClient)
    messageService = require('../../../server/services/message-service')
    messageReceiverInst = MessageReceiver.mock.instances[0]
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Message service sends the claim to two queues', async () => {
    const message = generateSampleClaim()

    await messageService.publishClaim(message)
    await expect(mockSend).toHaveBeenCalledTimes(2)
    await expect(mockSend).toHaveBeenCalledWith({ body: message })
  })

  test('Message service acts correctly to an error while sending', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    mockSend.mockImplementation(() => { throw new Error() })
    return expect(messageService.publishClaim(claimRecord)).rejects.toThrow()
  })

  test('Message receiver setup to listen to claim queue', async () => {
    await messageService.registerQueues()
    expect(messageReceiverInst.setupReceiver).toHaveBeenCalled()
  })

  test('Message receiver callback triggers message action', async () => {
    const sampleClaim = generateSampleClaim()
    await messageService.registerQueues()
    const callback = messageReceiverInst.setupReceiver.mock.calls[0][0]
    callback(sampleClaim)
    expect(claimMessageAction).toHaveBeenCalledWith(sampleClaim, expect.any(Function))
  })

  test('Message receiver callback passes publish claim as publisher', async () => {
    await messageService.registerQueues()
    const callback = messageReceiverInst.setupReceiver.mock.calls[0][0]
    callback(generateSampleClaim())
    expect(claimMessageAction).toHaveBeenCalledWith(expect.any(Object), messageService.publishClaim)
  })

  test('Message receiver connection closed', async () => {
    await messageService.closeConnections()
    expect(messageReceiverInst.closeConnection).toHaveBeenCalled()
  })

  const generateSampleClaim = () => ({
    claimId: 'MINE123',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: new Date(),
    mineType: ['gold', 'iron']
  })
})
