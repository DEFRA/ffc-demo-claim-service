const MessageSender = require('./messaging/message-sender')
console.debug('getting config')
const config = require('../config')

const calculationSender = new MessageSender('claim-service-calculation-sender', config.messageQueues.calculationQueue)
const scheduleSender = new MessageSender('claim-service-schedule-sender', config.messageQueues.scheduleQueue)

async function registerQueues () {
  await openConnections()
}

async function closeConnections () {
  await calculationSender.closeConnection()
  await scheduleSender.closeConnection()
}

async function openConnections () {
  await calculationSender.openConnection()
  await scheduleSender.openConnection()
}

async function publishClaim (claim) {
  try {
    const delivery = await Promise.all([
      calculationSender.sendMessage(claim),
      scheduleSender.sendMessage(claim)
    ])
    delivery.map(del => { console.log(del.settled) })
  } catch (err) {
    console.log(err)
    throw err
  }
}
module.exports = {
  registerQueues,
  publishClaim,
  openConnections,
  closeConnections
}
