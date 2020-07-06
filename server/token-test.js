const auth = require('@azure/ms-rest-nodeauth')
const { ServiceBusClient } = require('@azure/service-bus')
const Sequelize = require('sequelize')

const dbConfig = {
  username: process.env.POSTGRES_USERNAME_ALT,
  database: 'mine_claims_test_az',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  dialect: 'postgres',
  logging: false
}

let sequelize

async function testMessaging (sender) {
  try {
    const date = new Date()
    sender.send({ body: `Test message at ${date.toISOString()}` })
    console.log(`Sent message at ${date.toISOString()}`)
  } catch (err) {
    console.log('FAIL sending message')
  }
}

async function testDB (sequelize, postgresCreds) {
  try {
    await sequelize.authenticate()
    console.log('SUCCESS db auth')
  } catch (err) {
    console.log('FAIL db auth')
    await sequelizeSetup(postgresCreds)
    console.log('SUCCESS db re-authenticated')
  }
}

async function sequelizeSetup (postgresCreds) {
  dbConfig.password = postgresCreds.getToken()
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig)
  await sequelize.authenticate()
}

async function start () {
  const serviceBusCreds = await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net/' })
  const myBus = ServiceBusClient.createFromAadTokenCredentials(process.env.MESSAGE_QUEUE_HOST, serviceBusCreds)
  const sender = myBus.createQueueClient(process.env.CALCULATION_QUEUE_ADDRESS).createSender()

  // const postgresCreds = await auth.loginWithVmMSI({ resource: 'https://ossrdbms-aad.database.windows.net/' })
  // await sequelizeSetup(postgresCreds)

  testMessaging(sender)
  // await testDB(sequelize, postgresCreds)
  // await testDB(sequelize, postgresCreds)

  setInterval(() => testMessaging(sender), 1000 * 60 * 60)
  // setInterval(() => testDB(sequelize, postgresCreds), 1000 * 60 * 60)
}

module.exports = { start }
