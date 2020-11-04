const createClaim = require('./create-claim')

async function processClaimMessage (message) {
  try {
    await createClaim(message.body)
    await message.complete()
  } catch (err) {
    console.error('Unable to process message:', err)
    await message.abandon()
  }
}

module.exports = processClaimMessage
