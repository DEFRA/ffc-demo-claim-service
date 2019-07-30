let mockClaimRepository

describe('Test claim repository', () => {

  beforeEach(async () => {
    jest.mock('../server/models')
    jest.mock('../server/models/claim', () => {
      const SequelizeMock = require('sequelize-mock')
      const dbMock = new SequelizeMock()
      dbMock.$queueResult({
        claimId: 'MINE123',
        propertyType: 'business',
        accessible: false,
        dateOfSubsidence: new Date('2019-01-01 12:00:00')
      })
      return dbMock.define('claims', {
        claimId: 'MINE123',
        propertyType: 'business',
        accessible: false,
        dateOfSubsidence: new Date('2019-01-01 12:00:00')
      })
    })
  })

  test('Claim repository loads object from database', async () => {

    mockClaimRepository = require('../server/repository/claim-repository')
    const claim = await mockClaimRepository.getById('MINE123')
    await expect(claim.claimId).toEqual('MINE123')
    await expect(claim.propertyType).toEqual('business')
    await expect(claim.accessible).toEqual(false)
    await expect(claim.dateOfSubsidence).toEqual(new Date('2019-01-01 12:00:00'))
  })

  test('Claim repository creates object in database', async () => {
    mockClaimRepository = require('../server/repository/claim-repository')
    const claim = await mockClaimRepository.create({
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

  afterEach(async () => {
    jest.unmock('../server/models/claim')
    jest.unmock('../server/models')
  })
})
