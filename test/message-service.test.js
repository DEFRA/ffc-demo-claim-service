describe('Test message service', () => {
  let messageService
  let rheaPromiseMock

  beforeEach(async () => {
    messageService = require('../server/services/message-service')
    rheaPromiseMock = require('rhea-promise')
    jest.mock('rhea-promise')
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
    const claim = await messageService.publishClaim(claimRecord)
    await expect(rheaPromiseMock._SendFunction).toHaveBeenCalledTimes(2)
    await expect(rheaPromiseMock._SendFunction).toHaveBeenCalledWith({ body: jsonData })
  })

  afterEach(async () => {
    jest.unmock('rhea-promise')
  })
})
