module.exports = (sequelize, DataTypes) => {
  const Outbox = sequelize.define('outbox', {
    claimId: { type: DataTypes.STRING, primaryKey: true },
    published: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'outbox'
  })
  Outbox.associate = function (models) {
    Outbox.belongsTo(models.claims, {
      foreignKey: 'claimId',
      as: 'claim'
    })
  }
  return Outbox
}
