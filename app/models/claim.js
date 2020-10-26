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
  return Claim
}
