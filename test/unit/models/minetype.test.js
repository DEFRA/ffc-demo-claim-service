describe('Test minetype model', () => {
  test('Minetype model is created', async () => {
    jest.mock('sequelize', () => {
      const MockSequelize = require('sequelize-mock')
      return MockSequelize
    })
    const minetypeModel = require('../../../app/models/minetype')
    expect(minetypeModel.name).toEqual('')
  })
})
