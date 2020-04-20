'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn('claims', 'email', { type: Sequelize.STRING }, { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('claims', 'email', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
