const dbHelper = require('../../db-helper')
const messageService = require('../../../server/services/message-service')

const generateSampleClaim = () => ({
  email: 'test@test.com',
  claimId: 'MINE123',
  propertyType: 'business',
  accessible: false,
  dateOfSubsidence: new Date(),
  mineType: ['gold', 'iron']
})

describe('Test message service', () => {
  beforeEach(async () => {
    await dbHelper.truncate()
    jest.restoreAllMocks()
  })

  afterAll(() => {
    dbHelper.close()
  })

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
