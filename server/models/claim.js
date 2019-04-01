'use strict'
module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('claims', {
    claimId: { type: DataTypes.STRING, primaryKey: true },
    propertyType: DataTypes.STRING,
    dateOfSubsidence: DataTypes.DATE,
    accessible: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'claims'
  })
  Claim.associate = function (models) {
    // associations can be defined here
  }
  return Claim
}
