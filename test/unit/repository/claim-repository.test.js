const SequelizeMock = require('sequelize-mock')
const mockDb = new SequelizeMock()

let claimRepository

describe('Test claim repository', () => {
  beforeAll(async () => {
    jest.mock('../../../server/services/database-service', () => {
      return () => {
        return {
          models: {
            claims: mockDb.define('claims', {
              claimId: 'MINE123',
              propertyType: 'business',
              accessible: false,
              dateOfSubsidence: new Date('2019-01-01 12:00:00'),
              email: 'joe.bloggs@defra.gov.uk'
            })
          }
        }
      }
    })
    claimRepository = require('../../../server/repository/claim-repository')
  })

  test('Claim repository loads object from database', async () => {
    // You have to push a query result into a queue, as the mock db doesn't keep track.
    // Anything you push into the results queue is returned by the next query
    mockDb.$queueResult({
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date('2019-01-01 12:00:00'),
      email: 'joe.bloggs@defra.gov.uk'
    })
    const claim = await claimRepository.getById('MINE123')
    await expect(claim.claimId).toEqual('MINE123')
    await expect(claim.propertyType).toEqual('business')
    await expect(claim.accessible).toEqual(false)
    await expect(claim.dateOfSubsidence).toEqual(new Date('2019-01-01 12:00:00'))
    await expect(claim.email).toEqual('joe.bloggs@defra.gov.uk')
  })

  test('Claim repository creates object in database', async () => {
    mockDb.$queueResult({
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date('2019-01-01 12:00:00'),
      email: 'joe.bloggs@defra.gov.uk'
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
    await expect(claim.email).toEqual('joe.bloggs@defra.gov.uk')
  })

  test('Claim repository handles database failure', async () => {
    mockDb.$queueFailure(new SequelizeMock.ValidationError('Test error'))

    await expect(claimRepository.getById('MINE123')).rejects.toThrow()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
