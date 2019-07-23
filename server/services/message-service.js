const rheapromise = require('rhea-promise')
const config = require('../config')
const calculationQueue = 'calculation'
const scheduleQueue = 'schedule'
const connectionOptions = {
  transport: config.messageQueuePort === 5672 ? 'tcp' : 'ssl',
  port: config.messageQueuePort,
  reconnect_limit: 10,
  host: config.messageQueue,
  hostname: config.messageQueue,
  username: config.messageQueueUser,
  password: config.messageQueuePass
}

module.exports = {
  publishClaim: async function (claim) {
    try {
      const data = JSON.stringify(claim)
      const connection = new rheapromise.Connection(connectionOptions)
      const calculationQueueOptions = { target: { address: calculationQueue } }
      const scheduleQueueOptions = { target: { address: scheduleQueue } }

      try {
        await connection.open()

        const senders = []
        senders.push(connection.createSender(calculationQueueOptions))
        senders.push(connection.createSender(scheduleQueueOptions))

        const results = await Promise.all(senders)
        const delivery = await Promise.all(results.map(sender => { sender.send({ body: data }) }))

        delivery.map(del => { console.log(del) })

        await Promise.all(results.map(sender => {
          console.log(sender)
          sender.close()
        }))
        await connection.close()
      } catch (error) {
        console.log(error)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
