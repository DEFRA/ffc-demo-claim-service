require('./services/app-insights').setup()
const inboxService = require('./services/inbox-service')
const outboxService = require('./services/outbox-service')

process.on('SIGTERM', async function () {
  await inboxService.stop()
  await outboxService.stop()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await inboxService.stop()
  await outboxService.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await inboxService.start()
  await outboxService.start()
}())
