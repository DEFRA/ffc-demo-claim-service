const databaseService = require('../services/database-service')
const messageService = require('../services/message-service')

module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    handler: async (request, h) => {
      const calculationSender = messageService.getCalculationSender()
      const scheduleSender = messageService.getScheduleSender()

      const unavailableServices = []

      if (!await databaseService.isConnected()) {
        unavailableServices.push('database')
      }

      if (!calculationSender.isConnected()) {
        unavailableServices.push('calculation queue')
      }

      if (!scheduleSender.isConnected()) {
        unavailableServices.push('schedule queue')
      }

      let message = 'ok'
      let statusCode = 200

      if (unavailableServices.length > 0) {
        message = 'Downstream services unavailable: ' + unavailableServices.join(', ')
        statusCode = 500
      }

      return h.response(message).code(statusCode)
    }
  }
}
