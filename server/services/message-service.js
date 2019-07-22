const container = require('rhea')
const config = require('../config')

module.exports = {
  publishClaim: function (claim) {
    try {
      const calculationQueue = 'calculation'
      const scheduleQueue = 'schedule'
      const data = JSON.stringify(claim)
      let confirmed = 0
      let sent = 0
      let total = 2
      container.on('sendable', (context) => {
        sent++
        console.log(`Sent ${sent}`)
        context.sender.send({ body: data })
      })
      container.on('accepted', (context) => {
        console.log(`Confirmed ${confirmed + 1}`)
        console.log(context)
        if (++confirmed === total) {
          console.log('Closing connection')
          context.connection.close()
        }
      })
      container.on('disconnected', (context) => {
        if (context.error) {
          console.log('%s %j', context.error, context.error)
        }
        sent = confirmed
      })
      container.on('connection_open', (context) => {
        context.connection.open_sender(calculationQueue)
        context.connection.open_sender(scheduleQueue)
      })
      const activeMQOptions = {
        transport: config.messageQueuePort === 5672 ? 'tcp' : 'ssl',
        port: config.messageQueuePort,
        reconnect_limit: 10,
        host: config.messageQueue,
        hostname: config.messageQueue,
        username: config.messageQueueUser,
        password: config.messageQueuePass
      }
      container.connect(activeMQOptions)
    } catch (err) {
      console.log(err)
    }
  }
}
