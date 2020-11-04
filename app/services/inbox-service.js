const config = require('../config')
const mqConfig = config.messageQueues.claimQueue
const processClaimMessage = require('./process-claim-message')
const { MessageReceiver } = require('ffc-messaging')
let claimReceiver

async function start () {
  claimReceiver = new MessageReceiver(mqConfig, processClaimMessage)
  await claimReceiver.connect()
  console.info('Inbox service running')
}

async function stop () {
  await claimReceiver.closeConnection()
}

module.exports = { start, stop }
