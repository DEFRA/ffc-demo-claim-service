'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('claims', {
      claimId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      propertyType: {
        type: Sequelize.STRING
      },
      dateOfSubsidence: {
        type: Sequelize.DATE
      },
      accessible: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('claims')
  }
}
