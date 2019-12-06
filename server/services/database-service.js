const db = require('../models')

module.exports = {
  isConnected: async function () {
    try {
      await db.sequelize.authenticate()
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
