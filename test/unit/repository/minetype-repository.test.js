const SequelizeMock = require('sequelize-mock')
const mockDb = new SequelizeMock()

let minetypeRepository

describe('Test minetype repository', () => {
  beforeEach(async () => {
    jest.mock('../../../app/services/database-service', () => {
      return () => {
        return {
          models: {
            mineTypes: mockDb.define('mineTypes', {
              mineTypeId: 1,
              claimId: 'MINE123',
              mineType: 'gold'
            })
          }
        }
      }
    })
    minetypeRepository = require('../../../app/repository/minetype-repository')
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
    minetypeRepository = require('../../../app/repository/minetype-repository')

    mockDb.$queueFailure(new SequelizeMock.ValidationError('Test error'))

    return expect(minetypeRepository.create({
      mineTypeId: 1,
      claimId: 'MINE123',
      mineType: 'gold'
    })).rejects.toThrow()
  })
})
