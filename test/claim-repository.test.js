let claimRepository
let MockSequelize
let mockDb

describe('Test claim repository', () => {
  beforeAll(async () => {
    jest.mock('../server/models')
    jest.mock('../server/models/claim', () => {
      MockSequelize = require('sequelize-mock')
      mockDb = new MockSequelize()
      return mockDb.define('claims', {
        claimId: 'MINE123',
        propertyType: 'business',
        accessible: false,
        dateOfSubsidence: new Date('2019-01-01 12:00:00')
      })
    })
    claimRepository = require('../server/repository/claim-repository')
  })

  test('Claim repository loads object from database', async () => {
    // You have to push a query result into a queue, as the mock db doesn't keep track.
    // Anything you push into the results queue is returned by the next query
    mockDb.$queueResult({
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date('2019-01-01 12:00:00')
    })
    const claim = await claimRepository.getById('MINE123')
    await expect(claim.claimId).toEqual('MINE123')
    await expect(claim.propertyType).toEqual('business')
    await expect(claim.accessible).toEqual(false)
    await expect(claim.dateOfSubsidence).toEqual(new Date('2019-01-01 12:00:00'))
  })

  test('Claim repository creates object in database', async () => {
    mockDb.$queueResult({
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date('2019-01-01 12:00:00')
    })
    const claim = await claimRepository.create({
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date('2019-01-01 12:00:00')
    })
    await expect(claim.claimId).toEqual('MINE123')
    await expect(claim.propertyType).toEqual('business')
    await expect(claim.accessible).toEqual(false)
    await expect(claim.dateOfSubsidence).toEqual(new Date('2019-01-01 12:00:00'))
  })

  test('Claim repository handles database failure', async () => {
    mockDb.$queueFailure(new MockSequelize.ValidationError('Test error'))

    await expect(claimRepository.getById('MINE123')).rejects.toThrow()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    jest.unmock('../server/models/claim')
    jest.unmock('../server/models')
  })
})
