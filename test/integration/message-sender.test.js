const MessageSender = require('../../server/services/messaging/message-sender')
const createQueue = require('../../server/services/messaging/create-queue')
const purgeQueue = require('../../server/services/messaging/purge-queue')

const config = require('../../server/config')
const queueName = 'testq1'
const queueUrl = `${config.scheduleQueueConfig.endpoint}/queue/${queueName}`

beforeAll(async () => {
  await createQueue(queueName, config.scheduleQueueConfig)
})

afterAll(async () => {
  await purgeQueue(queueUrl, config.scheduleQueueConfig)
})

describe('send message', () => {
  test('sends a json message', async () => {
    jest.setTimeout(30000)
    const sender = new MessageSender(config.scheduleQueueConfig, queueUrl)
    const result = await sender.sendMessage({ greeting: 'test message' })
    console.log(result)
    expect(result).toBeDefined()
  })
})
