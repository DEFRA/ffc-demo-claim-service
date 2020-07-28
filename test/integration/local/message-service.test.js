const dbHelper = require('../../db-helper')
const asbHelper = require('../../asb-helper')

const generateSampleClaim = () => ({
  email: 'test@test.com',
  claimId: 'MINE123',
  propertyType: 'business',
  accessible: false,
  dateOfSubsidence: new Date(),
  mineType: ['gold', 'iron']
})

describe.only('Test message service', () => {
  let messageService

  beforeAll(async () => {
    messageService = await require('../../../server/services/message-service')
    await asbHelper.clearAllQueues()
  }, 30000)

  beforeEach(async () => {
    await dbHelper.truncate()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await asbHelper.clearAllQueues()
    await dbHelper.close()
    await messageService.closeConnections()
  }, 30000)

  test('Message service sends the claim to schedule queue', async () => {
    const message = generateSampleClaim()
    const scheduleSender = messageService.scheduleSender
    const spy = jest.spyOn(scheduleSender, 'sendMessage')

    await messageService.publishClaim(message)
    await expect(spy).toHaveBeenCalledTimes(1)
    await expect(spy).toHaveBeenCalledWith(message)
  })

  test('Message service sends the claim to calculation queue', async () => {
    const message = generateSampleClaim()
    const calculationSender = messageService.calculationSender
    const spy = jest.spyOn(calculationSender, 'sendMessage')

    await messageService.publishClaim(message)
    await expect(spy).toHaveBeenCalledTimes(1)
    await expect(spy).toHaveBeenCalledWith(message)
  })
})
