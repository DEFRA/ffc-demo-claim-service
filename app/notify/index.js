const { NotifyClient } = require('notifications-node-client')
const util = require('util')
const config = require('../config')

async function sendEmailNotification (claim) {
  if (config.notifyApiKey) {
    try {
      const notifyClient = new NotifyClient(config.notifyApiKey)
      await notifyClient.sendEmail(config.notifyEmailTemplateKey, claim.email, {
        personalisation: { claimId: claim.claimId }
      })
    } catch (err) {
      console.error('Unable to send email notification: ', util.inspect(err, false, null, true))
    }
  }
}

module.exports = { sendEmailNotification }
