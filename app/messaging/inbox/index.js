const config = require('../../config')
const mqConfig = config.messageQueues.claimQueue
const processClaimMessage = require('./process-claim-message')
const { MessageReceiver } = require('adp-messaging')
let claimReceiver

async function start () {
  const claimAction = message => processClaimMessage(message, claimReceiver)
  claimReceiver = new MessageReceiver(mqConfig, claimAction)
  await claimReceiver.subscribe()
  console.info('Inbox service running, ready to receive claims')
}

async function stop () {
  await claimReceiver.closeConnection()
}

module.exports = { start, stop }
