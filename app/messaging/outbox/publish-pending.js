const createMessage = require('./create-message')
const updatePublished = require('./update-published')
const getPendingClaims = require('./get-pending-claims')

async function publishPendingClaims (calculationSender, scheduleSender) {
  const claims = await getPendingClaims()
  for (const claim of claims) {
    await publishClaim(claim, calculationSender, scheduleSender)
  }
}

async function publishClaim (claim, calculationSender, scheduleSender) {
  try {
    const message = createMessage(claim)
    await calculationSender.sendMessage(message)
    await scheduleSender.sendMessage(message)
    await updatePublished(claim.claimId)
  } catch (err) {
    console.error('Unable to send claim: ', err)
  }
}

module.exports = publishPendingClaims
