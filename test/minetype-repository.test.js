let minetypeRepository
let MockSequelize
let mockDb

describe('Test minetype repository', () => {
  beforeEach(async () => {
    jest.mock('../server/models')
    jest.mock('../server/models/minetype', () => {
      MockSequelize = require('sequelize-mock')
      mockDb = new MockSequelize()
      return mockDb.define('mineTypes', {
        mineTypeId: 1,
        claimId: 'MINE123',
        mineType: 'gold'
      })
    })
    minetypeRepository = require('../server/repository/minetype-repository')
  })

  test('minetype repository loads object from database', async () => {
    // You have to push a query result into a queue, as the mock db doesn't keep track.
    // Anything you push into the results queue is returned by the next query
    mockDb.$queueResult({
      mineTypeId: 1,
      claimId: 'MINE123',
      mineType: 'gold'
    })
    const minetype = await minetypeRepository.create({
      mineTypeId: 1,
      claimId: 'MINE123',
      mineType: 'gold'
    })
    await expect(minetype.claimId).toEqual('MINE123')
    await expect(minetype.mineTypeId).toEqual(1)
    await expect(minetype.mineType).toEqual('gold')
  })

  test('minetype repository handles database failure', async () => {
    minetypeRepository = require('../server/repository/minetype-repository')

    mockDb.$queueFailure(new MockSequelize.ValidationError('Test error'))

    return expect(minetypeRepository.create({
      mineTypeId: 1,
      claimId: 'MINE123',
      mineType: 'gold'
    })).rejects.toThrow()
  })

  afterEach(async () => {
    jest.unmock('../server/models/minetype')
    jest.unmock('../server/models')
  })
})
