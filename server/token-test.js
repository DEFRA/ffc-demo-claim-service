const auth = require('@azure/ms-rest-nodeauth')
const { ServiceBusClient } = require('@azure/service-bus')

async function testCreds (sender, postgresCreds, date) {
  sender.send({ body: `Test message at ${date.toISOString()}` })
  console.log(`Sent message at ${date.toISOString()}`)

  const postgresToken = await postgresCreds.getToken()
  console.log('Postgres Token:')
  console.log(postgresToken)
}

async function start () {
  const serviceBusCreds = await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net/' })
  const postgresCreds = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net/' })
  const myBus = ServiceBusClient.createFromAadTokenCredentials(process.env.MESSAGE_QUEUE_HOST, serviceBusCreds)
  const sender = myBus.createQueueClient(process.env.CALCULATION_QUEUE_ADDRESS).createSender()
  const date = new Date()

  setInterval(() => testCreds(sender, postgresCreds, date), 1000 * 60 * 60)
}

module.exports = { start }
