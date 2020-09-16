const MessageReceiver = require('../../../server/services/messaging/message-receiver')
const MessageService = require('../../../server/services/message-service')
const MessageSender = require('../../../server/services/messaging/message-sender')
const config = require('../../../server/config')
const dbHelper = require('../../db-helper')
const asbHelper = require('../../asb-helper')

const generateSampleClaim = () => ({
  email: 'test@test.com',
  claimId: 'MINE123',
  propertyType: 'business',
  accessible: false,
  dateOfSubsidence: new Date(),
  mineType: ['gold', 'iron']
})

describe.only('Test message service', () => {
  let messageReceiver
  let messageService
  let message
  const testConfig = { ...config.messageQueues.claimQueue }

  beforeAll(async () => {
    await asbHelper.clearAllQueues()
    message = generateSampleClaim()
    messageService = await MessageService()

    const messageSender = new MessageSender('message-service-sender-test', testConfig)
    await messageSender.sendMessage(message)
  }, 30000)

  afterAll(async () => {
    await messageService.closeConnections()
    await messageReceiver.closeConnections()
    await asbHelper.clearAllQueues()
    await dbHelper.close()
  }, 30000)

  test('Processed message ends up on scheduleQueue', async () => {
    let done
    const promise = new Promise((resolve) => {
      done = resolve
    })
    const action = (result) => {
      done(result.hello === message.hello)
    }

    messageReceiver = new MessageReceiver('test-receiver', { ...config.messageQueues.scheduleQueue }, undefined, action)
    return expect(promise).resolves.toEqual(true)
  })

  test('Processed message ends up on calculationQueue', async () => {
    let done
    const promise = new Promise((resolve) => {
      done = resolve
    })
    const action = (result) => {
      done(result.hello === message.hello)
    }

    messageReceiver = new MessageReceiver('test-receiver', { ...config.messageQueues.calculationQueue }, undefined, action)
    return expect(promise).resolves.toEqual(true)
  })
})
