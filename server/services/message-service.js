const rheapromise = require('rhea-promise')
const config = require('../config')
const calculationQueue = 'calculation'
const scheduleQueue = 'schedule'

module.exports = {

  configureMQ: function (options) {
    return {
      transport: options.transport,
      port: options.port,
      reconnect_limit: 10,
      host: options.address,
      hostname: options.address,
      username: options.user,
      password: options.pass
    }
  },

  sendClaim: async function (claim, connection, queueName) {
    const data = JSON.stringify(claim)
    const queueOptions = { target: { address: queueName } }
    const sender = await connection.createSender(queueOptions)
    let delivery
    try {
      console.log(`Sending claim to ${queueName}`)
      delivery = await sender.send({ body: data })
    } catch (error) {
      throw error
    }
    await sender.close()
    return delivery
  },

  publishClaim: async function (claim, messageQueueOptions) {
    try {
      const connectionOptions = this.configureMQ(messageQueueOptions || config.messageQueue)
      console.log(connectionOptions)

      const connection = new rheapromise.Connection(connectionOptions)
      console.log('New claim to send to message queues : ', claim)
      try {
        await connection.open()

        const delivery = await Promise.all([
          this.sendClaim(claim, connection, calculationQueue),
          this.sendClaim(claim, connection, scheduleQueue)
        ])
        delivery.map(del => { console.log(del.settled) })
      } catch (error) {
        console.log(error)
        throw error
      }
      await connection.close()
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
