describe('Test Claim model', () => {
  test('claim model is created', async () => {
    jest.mock('sequelize', () => {
      const mockSequelize = require('sequelize-mock')
      return mockSequelize
    })
    const claimModel = require('../../server/models/claim')
    expect(claimModel.name).toEqual('')
  })
})
