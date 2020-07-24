const dbHelper = require('../../db-helper')
const asbHelper = require('../../asb-helper')
const messageService = require('../../../server/services/message-service')

const generateSampleClaim = () => ({
  email: 'test@test.com',
  claimId: 'MINE123',
  propertyType: 'business',
  accessible: false,
  dateOfSubsidence: new Date(),
  mineType: ['gold', 'iron']
})

describe.only('Test message service', () => {
  beforeAll(async () => {
    await messageService.createConnections()
    await asbHelper.clearAllQueues()
  }, 30000)

  beforeEach(async () => {
    await dbHelper.truncate()
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await asbHelper.clearAllQueues()
    dbHelper.close()
  }, 30000)

  test('Message service sends the claim to schedule queue', async () => {
    const message = generateSampleClaim()
    const scheduleSender = messageService.getScheduleSender()
    const spy = jest.spyOn(scheduleSender, 'sendMessage')

    await messageService.publishClaim(message)
    await expect(spy).toHaveBeenCalledTimes(1)
    await expect(spy).toHaveBeenCalledWith(message)
  })

  test('Message service sends the claim to calculation queue', async () => {
    const message = generateSampleClaim()
    const calculationSender = messageService.getCalculationSender()
    const spy = jest.spyOn(calculationSender, 'sendMessage')

    await messageService.publishClaim(message)
    await expect(spy).toHaveBeenCalledTimes(1)
    await expect(spy).toHaveBeenCalledWith(message)
  })
})
