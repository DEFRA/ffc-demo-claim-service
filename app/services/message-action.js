const claimSchema = require('../schema/claim')
const claimService = require('./claim-service')

async function claimMessageAction (claim, publisher) {
  try {
    console.log('message received - claim ', claim)
    await claimSchema.validateAsync(claim)
    await claimService.create(claim, publisher)
  } catch (ex) {
    console.error('unable to process message ', ex)
  }
}

module.exports = { claimMessageAction }
