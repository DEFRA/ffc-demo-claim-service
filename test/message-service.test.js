jest.mock('rhea-promise')
jest.mock('../server/config', () => ({
  messageQueues: {
    calculationQueue: 'calculationQueue',
    scheduleQueue: 'scheduleQueue',
    claimQueue: 'claimQueue'
  }
}))
jest.mock('../server/services/messaging/message-receiver')
jest.mock('../server/services/message-action', () => ({
  claimMessageAction: jest.fn()
}))
jest.mock('../server/services/claim-service')
const mockSender = {
  close: () => {},
  send: jest.fn(async () => ({ settled: 'settled' }))
}
const mockConnection = {
  open: () => {},
  close: () => {},
  isOpen: () => true,
  createAwaitableSender: async () => mockSender
}
const MessageReceiver = require('../server/services/messaging/message-receiver.js')
const { claimMessageAction } = require('../server/services/message-action')

describe('Test message service', () => {
  let messageService
  let rheaPromiseMock
  let messageReceiverInst

  beforeAll(async () => {
    rheaPromiseMock = require('rhea-promise')
    rheaPromiseMock.Container.mockImplementation(() => ({
      identifyYourself: 'abc',
      createConnection: () => mockConnection
    }))
    messageService = require('../server/services/message-service')
    messageReceiverInst = MessageReceiver.mock.instances[0]
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Message service sends the claim to two queues', async () => {
    const claimRecord = generateSampleClaim()
    const jsonData = JSON.stringify(claimRecord)

    await messageService.publishClaim(claimRecord)
    await expect(mockSender.send).toHaveBeenCalledTimes(2)
    await expect(mockSender.send).toHaveBeenCalledWith({ body: jsonData })
  })

  test('Message service acts correctly to an error while sending', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    mockSender.send.mockImplementation(() => { throw new Error() })
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
