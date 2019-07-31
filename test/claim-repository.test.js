let claimRepository
let mockSequelize
let mockDb

describe('Test claim repository', () => {

  beforeEach(async () => {
    jest.mock('../server/models')
    jest.mock('../server/models/claim', () => {
      mockSequelize = require('sequelize-mock')
      mockDb = new mockSequelize()
      return mockDb.define('claims', {
        claimId: 'MINE123',
        propertyType: 'business',
        accessible: false,
        dateOfSubsidence: new Date('2019-01-01 12:00:00')
      })
    })
  })

  test('Claim repository loads object from database', async () => {
    claimRepository = require('../server/repository/claim-repository')
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
    claimRepository = require('../server/repository/claim-repository')
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
    return expect(claim.dateOfSubsidence).toEqual(new Date('2019-01-01 12:00:00'))
  })

  test('Claim repository handles database failure', async () => {
    claimRepository = require('../server/repository/claim-repository')

    mockDb.$queueFailure(new mockSequelize.ValidationError('Test error'))

    return expect(claimRepository.getById('MINE123')).rejects.toThrow()
  })

  afterEach(async () => {
    jest.unmock('../server/models/claim')
    jest.unmock('../server/models')
  })
})

describe('Test Claim model', () => {
  test('claim model is created', async () => {
    jest.mock('sequelize', () => {
      const mockSequelize = require('sequelize-mock')
      return mockSequelize
    })
    const claimModel = require('../server/models/claim')
    expect(claimModel.name).toEqual('')
  })
})
