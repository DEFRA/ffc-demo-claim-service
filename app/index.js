require('./services/app-insights').setup()
const inbox = require('./messaging/inbox')
const outbox = require('./messaging/outbox')

process.on('SIGTERM', async function () {
  await inbox.stop()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await inbox.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await inbox.start()
  await outbox.start()
}())
