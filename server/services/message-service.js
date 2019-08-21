const rheaPromise = require('rhea-promise')
const config = require('../config')

function onSenderError (context, name) {
  const senderError = context.sender && context.sender.error
  if (senderError) {
    console.error(`sender error for ${name}`, senderError)
  }
}

function onSessionError (context, name) {
  const sessionError = context.session && context.session.error
  if (sessionError) {
    console.error(`session error for ${name}`, sessionError)
  }
}

module.exports = {
  sendClaim: async function (claim, connection, queueConfig) {
    const data = JSON.stringify(claim)
    const senderName = 'claim-service-sender'
    const queueOptions = {
      name: senderName,
      onError: (context) => onSenderError(context, senderName),
      onSessionError: (context) => onSessionError(context, senderName),
      sendTimeoutInSeconds: queueConfig.sendTimeoutInSeconds,
      target: { address: queueConfig.address }
    }
    const sender = await connection.createSender(queueOptions)
    let delivery
    try {
      console.log(`Sending claim to ${queueConfig.address}`)
      delivery = await sender.send({ body: data })
    } catch (error) {
      throw error
    }
    await sender.close()
    return delivery
  },

  publishClaim: async function (claim) {
    try {
      console.log('New claim to send to message queues : ', claim)

      const calculationQueueConnection = new rheaPromise.Connection(config.messageQueues.calculationQueue)
      const scheduleQueueConnection = new rheaPromise.Connection(config.messageQueues.scheduleQueue)

      await calculationQueueConnection.open()
      await scheduleQueueConnection.open()

      const delivery = await Promise.all([
        this.sendClaim(claim, calculationQueueConnection, config.messageQueues.calculationQueue),
        this.sendClaim(claim, scheduleQueueConnection, config.messageQueues.scheduleQueue)
      ])
      delivery.map(del => { console.log(del.settled) })
      await calculationQueueConnection.close()
      await scheduleQueueConnection.close()
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
