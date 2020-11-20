const { NotifyClient } = require('notifications-node-client')
const config = require('../config')

async function sendEmailNotification (claim) {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey)
    await notifyClient.sendEmail(config.notifyEmailTemplateKey, claim.email, {
      personalisation: { claimId: claim.claimId }
    })
  }
}

module.exports = { sendEmailNotification }
