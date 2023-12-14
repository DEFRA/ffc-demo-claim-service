const { environments } = require('../../../app/config/constants')

describe('environments', () => {
  test('should export environment values', () => {
    expect(environments).toEqual({
      development: 'development',
      production: 'production',
      test: 'test'
    })
  })
})
