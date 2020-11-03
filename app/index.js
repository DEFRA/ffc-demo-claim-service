require('./services/app-insights').setup()
const messageService = require('./services/message-service')

process.on('SIGTERM', async function () {
  await messageService.stop()
  process.exit(0)
})

process.on('SIGINT', async function () {
  await messageService.stop()
  process.exit(0)
})

module.exports = (async function startService () {
  await messageService.start()
}())
