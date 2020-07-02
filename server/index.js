const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  await config()
  const messageService = require('./services/message-service')

  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/error-pages'))

  if (config.isDev) {
    await server.register(require('blipp'))
    await server.register(require('./plugins/logging'))
  }

  await messageService.registerQueues()

  // Testing
  // await messageService.publishClaim({ message: 'this is a test' })

  process.on('SIGTERM', async function () {
    console.log('SIGTERM')
    await messageService.closeConnections()
    process.exit(0)
  })

  process.on('SIGINT', async function () {
    console.log('SIGINT')
    await messageService.closeConnections()
    process.exit(0)
  })

  return server
}

module.exports = createServer
