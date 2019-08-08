describe('Test message service', () => {
  let messageService
  let rheaPromiseMock
  jest.mock('rhea-promise')

  beforeAll(async () => {
    messageService = require('../server/services/message-service')
    rheaPromiseMock = require('rhea-promise')
  })

  test('Message service sends the claim to two queues', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    const jsonData = JSON.stringify(claimRecord)
    rheaPromiseMock._SendFunction.mockReset()
    rheaPromiseMock._SendFunction.mockImplementation(function () {
      return new rheaPromiseMock.Delivery()
    })
    await messageService.publishClaim(claimRecord)
    await expect(rheaPromiseMock._SendFunction).toHaveBeenCalledTimes(2)
    await expect(rheaPromiseMock._SendFunction).toHaveBeenCalledWith({ body: jsonData })
  })

  test('Message service acts correctly to an error while sending', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    rheaPromiseMock._SendFunction.mockReset()
    rheaPromiseMock._SendFunction.mockImplementation(function () {
      throw new Error()
    })
    return expect(messageService.publishClaim(claimRecord)).rejects.toThrow()
  })

  afterAll(async () => {
    jest.unmock('rhea-promise')
  })
})
