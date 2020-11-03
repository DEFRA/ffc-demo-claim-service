module.exports = (sequelize, DataTypes) => {
  const Outbox = sequelize.define('outbox', {
    claimId: { type: DataTypes.STRING, primaryKey: true },
    published: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'outbox',
    timestamps: false
  })
  Outbox.associate = function (models) {
    Outbox.belongsTo(models.claims, {
      as: 'claim'
    })
  }
  return Outbox
}
