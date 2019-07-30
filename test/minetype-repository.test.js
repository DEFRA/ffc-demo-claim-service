let mockMinetypeRepository

describe('Test minetype repository', () => {

  beforeEach(async () => {
    jest.mock('../server/models')
    jest.mock('../server/models/minetype', () => {
      const SequelizeMock = require('sequelize-mock')
      const dbMock = new SequelizeMock()
      dbMock.$queueResult({
        mineTypeId: 1,
        claimId: 'MINE123',
        mineType: 'gold'
      })
      return dbMock.define('mineTypes', {
        mineTypeId: 1,
        claimId: 'MINE123',
        mineType: 'gold'
      })
    })
  })

  test('Claim repository loads object from database', async () => {

    mockMinetypeRepository = require('../server/repository/minetype-repository')
    const minetype = await mockMinetypeRepository.create('MINE123')
    await expect(minetype.claimId).toEqual('MINE123')
    await expect(minetype.mineTypeId).toEqual(1)
    await expect(minetype.mineType).toEqual('gold')
  })

  afterEach(async () => {
    jest.unmock('../server/models/minetype')
    jest.unmock('../server/models')
  })
})
