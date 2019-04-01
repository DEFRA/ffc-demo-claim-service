'use strict'
module.exports = (sequelize, DataTypes) => {
  const MineType = sequelize.define('mineTypes', {
    mineTypeId: { type: DataTypes.INTEGER, primaryKey: true },
    claimId: DataTypes.STRING,
    mineType: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'mineTypes'
  })
  MineType.associate = function (models) {
    // associations can be defined here
    MineType.belongsTo(models.claims, {
      foreignKey: 'claimId'
    })
  }
  return MineType
}
