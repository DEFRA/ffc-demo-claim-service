const databaseService = require('../services/database-service')

module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    handler: async (request, h) => {
      if (await databaseService.isConnected()) {
        return h.response('ok').code(200)
      }
      return h.response('database unavailable').code(503)
    }
  }
}
