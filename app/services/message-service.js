const config = require('../config')
const mqConfig = config.messageQueues.claimQueue
const createClaim = require('./create-claim')
const { MessageReceiver } = require('ffc-messaging')
let claimReceiver

async function start () {
  claimReceiver = new MessageReceiver(mqConfig, createClaim)
  await claimReceiver.connect()
}

async function stop () {
  await claimReceiver.closeConnection()
}

module.exports = { start, stop }
