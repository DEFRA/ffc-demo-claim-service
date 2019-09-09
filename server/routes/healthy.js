const databaseService = require('../services/database-service')
const messageService = require('../services/message-service')

module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    handler: async (request, h) => {
      const calculationSender = messageService.getCalculationSender()
      const scheduleSender = messageService.getScheduleSender()

      const connections = {
        calculationQueue: calculationSender.isConnected(),
        database: await databaseService.isConnected(),
        scheduleQueue: scheduleSender.isConnected()
      }

      const brokenConnections = Object.keys(connections)
        .filter(service => !connections[service])
        .join(', ')

      const allConnected = brokenConnections.length === 0

      const message = allConnected ? 'ok' : `Dependencies unavailable: ${brokenConnections}`
      const statusCode = allConnected ? 200 : 500

      return h.response(message).code(statusCode)
    }
  }
}
