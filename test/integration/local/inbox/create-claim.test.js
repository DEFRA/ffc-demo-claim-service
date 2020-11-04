const { models } = require('../../../../app/services/database-service')()
const createClaim = require('../../../../app/messaging/inbox/create-claim')
const dbHelper = require('../../../db-helper')

describe('create claim', () => {
  beforeEach(async () => {
    await dbHelper.truncate()
  })

  afterEach(async () => {
    await dbHelper.truncate()
  })

  afterAll(async () => {
    await dbHelper.close()
  })

  test('should rollback invalid', async () => {
    await expect(createClaim('not a claim')).rejects.toThrow()
    const claims = await models.claims.findAll({ raw: true })
    expect(claims.length).toBe(0)
  })
})
