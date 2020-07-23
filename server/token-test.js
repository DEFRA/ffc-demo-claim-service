const auth = require('@azure/ms-rest-nodeauth')
const { ManagedIdentityCredential } = require('@azure/identity')
const { ServiceBusClient } = require('@azure/service-bus')
const Sequelize = require('sequelize')

const dbConfig = {
  username: process.env.POSTGRES_USERNAME_ALT,
  database: 'mine_claims_test_ad',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  dialect: 'postgres',
  logging: false
}

let sequelize

async function testMessaging (sender) {
  const date = new Date()

  try {
    sender.send({ body: `Test message using Azure Identity Token at ${date.toISOString()}` })
    console.log(`Sent message to ${process.env.CALCULATION_QUEUE_ADDRESS} at ${date.toISOString()}`)
  } catch (err) {
    console.log(`FAIL sending message to ${process.env.CALCULATION_QUEUE_ADDRESS} at ${date.toISOString()}`)
    console.log(err)
  }
}

async function testDB (postgresCreds) {
  const date = new Date()

  try {
    await sequelize.authenticate()
    console.log(`SUCCESS db auth at ${date.toISOString()}`)
  } catch (err) {
    console.log(`FAIL db auth at ${date.toISOString()}`)
    console.log(err)
    await sequelizeSetup(postgresCreds)
  }
}

async function sequelizeSetup (postgresCreds) {
  try {
    const token = await postgresCreds.getToken('https://ossrdbms-aad.database.windows.net')
    dbConfig.password = token.token
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)
    console.log('Attempting authenticate ...')
    await sequelize.authenticate()
    console.log('SUCCESS sequelize init and auth')
  } catch (err) {
    console.log('FAIL sequelize init and auth')
    console.log(err)
  }
}

async function start () {
  const testAzureIdenitityCredential = new ManagedIdentityCredential()
  const myBus = ServiceBusClient.createFromAadTokenCredentials(process.env.MESSAGE_QUEUE_HOST, testAzureIdenitityCredential)
  const sender = myBus.createQueueClient(process.env.CALCULATION_QUEUE_ADDRESS).createSender()

  // const postgresCreds = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net' })
  await sequelizeSetup(testAzureIdenitityCredential)

  testMessaging(sender)
  testDB(testAzureIdenitityCredential)

  setInterval(() => testMessaging(sender), 1000 * 60 * 60)
  setInterval(() => testDB(testAzureIdenitityCredential), 1000 * 60 * 60)
}

module.exports = { start }
