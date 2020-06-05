const claimSchema = require('../schema/claimFromMessage')
const claimService = require('./claim-service')

async function claimMessageAction (message) {
  try {
    console.log('message received - claim ', message.Body)
    const claim = JSON.parse(message.Body)
    await claimSchema.validateAsync(claim)
    await claimService.create(claim)
  } catch (ex) {
    console.error('unable to process message ', ex)
  }
}

module.exports = { claimMessageAction }
