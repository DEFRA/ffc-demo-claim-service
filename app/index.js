require('./services/app-insights').setup()
const messageService = require('./services/message-service')
const outboxService = require('./services/outbox-service')

process.on('SIGTERM', async function () {
  await messageService.stop()
  await outboxService.stop()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await messageService.stop()
  await outboxService.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await messageService.start()
  await outboxService.start()
}())
