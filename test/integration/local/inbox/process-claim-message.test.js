const dbHelper = require('../../../db-helper')
const processClaimMessage = require('../../../../app/messaging/inbox/process-claim-message')
const { models } = require('../../../../app/services/database-service')()

describe('processing claim message', () => {
  const message = {
    body: {
      claimId: 'MINE1',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: '2019-07-26T09:54:19.622Z',
      mineType: ['gold', 'silver'],
      email: 'joe.bloggs@defra.gov.uk'
    },
    complete: jest.fn(),
    abandon: jest.fn()
  }

  beforeEach(async () => {
    await dbHelper.truncate()
  })

  afterEach(async () => {
    await dbHelper.truncate()
  })

  afterAll(async () => {
    await dbHelper.close()
  })

  test('should save valid claim', async () => {
    await processClaimMessage(message)
    const claims = await models.claims.findAll({ where: { claimId: message.body.claimId }, raw: true })
    expect(claims.length).toBe(1)
  })

  test('should save valid claim mineTypes', async () => {
    await processClaimMessage(message)
    const mineTypes = await models.mineTypes.findAll({ where: { claimId: message.body.claimId }, raw: true })
    expect(mineTypes.length).toBe(2)
    expect(mineTypes.filter(x => x.mineType === 'gold').length).toBe(1)
    expect(mineTypes.filter(x => x.mineType === 'silver').length).toBe(1)
  })

  test('should save valid claim outbox', async () => {
    await processClaimMessage(message)
    const outbox = await models.outbox.findAll({ where: { claimId: message.body.claimId, published: false }, raw: true })
    expect(outbox.length).toBe(1)
  })

  test('should not save duplicate claim', async () => {
    await processClaimMessage(message)
    await processClaimMessage(message)
    const claims = await models.claims.findAll({ where: { claimId: message.body.claimId }, raw: true })
    expect(claims.length).toBe(1)
  })

  test('should complete valid claim', async () => {
    await processClaimMessage(message)
    expect(message.complete).toHaveBeenCalled()
  })

  test('should abandon invalid claim', async () => {
    message.body = 'not a claim'
    await processClaimMessage(message)
    expect(message.abandon).toHaveBeenCalled()
  })
})
