require('./services/app-insights').setup()
const createMessageService = require('./services/message-service')
let messageService

process.on('SIGTERM', async function () {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await messageService.closeConnections()
  process.exit(0)
})

module.exports = (async function startService () {
  messageService = await createMessageService()
}())
