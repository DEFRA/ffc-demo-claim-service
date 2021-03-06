module.exports = (sequelize, DataTypes) => {
  const MineType = sequelize.define('mineTypes', {
    mineTypeId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    claimId: DataTypes.STRING,
    mineType: DataTypes.STRING
  }, {
    freezeTableName: true,
    tableName: 'mineTypes'
  })
  MineType.associate = function (models) {
    MineType.belongsTo(models.claims, {
      foreignKey: 'claimId'
    })
  }
  return MineType
}
