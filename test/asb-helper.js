const { ReceiveMode, ServiceBusClient } = require('@azure/service-bus')
const config = require('../server/config/mq-config')

// When calling this witin a test script, ensure there is a generous timeout
// for the connections to complete within. `30000` should be good
async function clearQueue (queueName) {
  // There are three queues with potentially three different hosts and
  // credentials, however, atm there is only the single instance
  let sbClient
  try {
    const connectionString = `Endpoint=sb://${config.claimQueue.host}/;SharedAccessKeyName=${config.claimQueue.username};SharedAccessKey=${config.claimQueue.password}`
    sbClient = ServiceBusClient.createFromConnectionString(connectionString)

    const queueAddress = config[queueName].address
    const queueClient = sbClient.createQueueClient(queueAddress)
    const receiver = queueClient.createReceiver(ReceiveMode.receiveAndDelete)

    console.log(`Setup to receive messages from '${queueAddress}'.`)
    // there shouldn't be more than a handful of messages in any queue and they
    // are recieved in blocks of `batchSize`, in as many `batches` as specified
    const batches = 10
    for (let j = 0; j < batches; j++) {
      console.log(`Receiving messages, batch ${j + 1}.`)
      const batchSize = 20
      const messages = await receiver.receiveMessages(batchSize, 5)
      const receivedBatchSize = messages.length
      console.log(`Received (and deleted) ${receivedBatchSize} messages.`)

      if (receivedBatchSize <= batchSize) {
        console.log(`No more messages in: '${queueAddress}'.`)
        break
      }
    }
    await queueClient.close()
  } catch (err) {
    console.log(err)
    throw err
  } finally {
    await sbClient.close()
  }
}

async function clearAllQueues () {
  await clearQueue('calculationQueue')
  await clearQueue('claimQueue')
  await clearQueue('scheduleQueue')
}

module.exports = {
  clearAllQueues,
  clearQueue
}
