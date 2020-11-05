const dbHelper = require('../../../db-helper')
const getPendingClaims = require('../../../../app/messaging/outbox/get-pending-claims')

describe('get pending claims', () => {
  const claims = [{
    claimId: 'MINE1',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }, {
    claimId: 'MINE2',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }]

  const outbox = [{
    claimId: 'MINE1',
    published: true
  }, {
    claimId: 'MINE2',
    published: false
  }]

  beforeAll(async () => {
    await dbHelper.truncate()
    await dbHelper.createClaimRecords(claims)
    await dbHelper.createOutboxRecords(outbox)
  })

  afterAll(async () => {
    await dbHelper.truncate()
    await dbHelper.close()
  })

  test('should return pending', async () => {
    const claims = await getPendingClaims()
    expect(claims.length).toBe(1)
    expect(claims[0].claimId).toBe('MINE2')
  })
})
