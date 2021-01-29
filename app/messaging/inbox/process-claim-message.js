const createClaim = require('./create-claim')

async function processClaimMessage (message, claimReceiver) {
  try {
    await createClaim(message.body)
    await claimReceiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process message:', err)
    await claimReceiver.abandonMessage(message)
  }
}

module.exports = processClaimMessage
