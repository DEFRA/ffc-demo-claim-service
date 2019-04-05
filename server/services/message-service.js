const amqp = require('amqplib/callback_api')

module.exports = {
  publishClaim: function (claim) {
    amqp.connect('amqp://localhost', function (err, conn) {
      if (err) {
        console.log(err)
      }
      conn.createChannel(function (err, ch) {
        if (err) {
          console.log(err)
        }

        const data = JSON.stringify(claim)

        const calculationQueue = 'calculation'
        ch.assertQueue(calculationQueue, { durable: false })
        ch.sendToQueue(calculationQueue, Buffer.from(data))
        console.log('claim queued for calculation')

        const scheduleQueue = 'schedule'
        ch.assertQueue(scheduleQueue, { durable: false })
        ch.sendToQueue(scheduleQueue, Buffer.from(data))
        console.log('claim queued for scheduling')
      })
    })
  }
}
