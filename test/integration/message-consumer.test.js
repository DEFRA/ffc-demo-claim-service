const MessageConsumer = require('../../server/services/messaging/message-consumer')
const MessageSender = require('../../server/services/messaging/message-sender')
const createQueue = require('../../server/services/messaging/create-queue')
const purgeQueue = require('../../server/services/messaging/purge-queue')

const config = require('../../server/config')
const queueName = 'testq2'
const queueUrl = `${config.calculationQueueConfig.endpoint}/queue/${queueName}`

let consumer, sender, receivedCount

const greeting = 'test message'
const redeliverGreeting = 'test redelivered message'

function messageHandler (message, done) {
  console.log('received message', message)
  const data = JSON.parse(message.Body)
  expect(data.greeting).toEqual(greeting)
  done()
  return true
}

function messageHandlerErrorOnFirst (message, done) {
  if (receivedCount === 0) {
    receivedCount++
    throw new Error('ignore first delivery of message by throwing error')
  }
  console.log('received message again', message)
  const data = JSON.parse(message.Body)
  expect(data.greeting).toEqual(redeliverGreeting)
  done()
  return true
}

beforeAll(async () => {
  await createQueue(queueName, config.calculationQueueConfig)
  sender = new MessageSender(config.calculationQueueConfig, queueUrl)
})

afterEach(async () => {
  consumer && consumer.stop()
  await purgeQueue(queueUrl, config.calculationQueueConfig)
})

describe('consume message', () => {
  jest.setTimeout(15000)
  test('consume a json message', (done) => {
    sender.sendMessage({ greeting: greeting }).then(() => {
      consumer = new MessageConsumer(config.calculationQueueConfig, queueUrl, (message) => messageHandler(message, done))
      consumer.start()
    })
  })
  test('message is redelivered after a client error', (done) => {
    receivedCount = 0
    sender.sendMessage({ greeting: redeliverGreeting }).then(() => {
      consumer = new MessageConsumer(config.calculationQueueConfig, queueUrl, (message) => messageHandlerErrorOnFirst(message, done))
      consumer.start()
    })
  })
})
