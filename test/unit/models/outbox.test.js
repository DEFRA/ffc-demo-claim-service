const sequelize = {
  define: jest.fn(() => ({
    associate: jest.fn()
  }))
}
const DataTypes = {
  STRING: 'string',
  DATE: 'date',
  BOOLEAN: 'boolean',
  INTEGER: 'integer'
}

describe('Outbox Model', () => {
  let Outbox
  beforeEach(() => {
    jest.clearAllMocks()
    Outbox = require('../../../app/models/outbox')(sequelize, DataTypes)
  })

  test('should define the model with correct fields', () => {
    expect(sequelize.define).toHaveBeenCalledWith(
      'outbox',
      {
        claimId: { type: 'string', primaryKey: true },
        published: 'boolean'
      },
      {
        freezeTableName: true,
        tableName: 'outbox',
        timestamps: false
      }
    )
    expect(Outbox.associate).toBeDefined()
  })
})
