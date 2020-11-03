module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('claims', {
    claimId: { type: DataTypes.STRING, primaryKey: true },
    propertyType: DataTypes.STRING,
    dateOfSubsidence: DataTypes.DATE,
    accessible: DataTypes.BOOLEAN,
    email: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'claims'
  })
  Claim.associate = function (models) {
    Claim.hasOne(models.outbox, {
      as: 'claim'
    })
  }
  return Claim
}
