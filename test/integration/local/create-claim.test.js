const { models } = require('../../../app/services/database-service')()
const createClaim = require('../../../app/services/create-claim')
const dbHelper = require('../../db-helper')

describe('create claim', () => {
  beforeEach(async () => {
    await dbHelper.truncate()
  })

  afterEach(async () => {
    await dbHelper.truncate()
  })

  afterAll(async () => {
    await dbHelper.close()
  })

  const claim = {
    claimId: 'MINE1',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }

  test('should save valid claim', async () => {
    await createClaim(claim)
    const claims = await models.claims.findAll({ where: { claimId: claim.claimId }, raw: true })
    expect(claims.length).toBe(1)
  })

  test('should save valid claim mineTypes', async () => {
    await createClaim(claim)
    const mineTypes = await models.mineTypes.findAll({ where: { claimId: claim.claimId }, raw: true })
    expect(mineTypes.length).toBe(2)
    expect(mineTypes.filter(x => x.mineType === 'gold').length).toBe(1)
    expect(mineTypes.filter(x => x.mineType === 'silver').length).toBe(1)
  })

  test('should save valid claim outbox', async () => {
    await createClaim(claim)
    const outbox = await models.outbox.findAll({ where: { claimId: claim.claimId, published: false }, raw: true })
    expect(outbox.length).toBe(1)
  })
})
