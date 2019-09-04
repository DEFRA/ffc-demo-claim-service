const databaseService = require('../services/database-service')
const messageService = require('../services/message-service')

module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    handler: async (request, h) => {
      let message = 'ok'
      let statusCode = 200
      const unavailableServices = []

      if (!await databaseService.isConnected()) {
        unavailableServices.push('database')
      }

      if (!messageService.isConnected()) {
        unavailableServices.push('message queue')
      }

      if (unavailableServices.length > 0) {
        message = 'Downstream services unavailable: ' + unavailableServices.join(', ')
        statusCode = 500
      }

      console.debug(message)

      return h.response(message).code(statusCode)
    }
  }
}
