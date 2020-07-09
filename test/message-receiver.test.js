const { mockSBClient, ServiceBusClientMock } = require('./mocks/serviceBusMocks')
const MessageReceiver = require('../server/services/messaging/message-receiver')
const MessageSender = require('../server/services/messaging/message-sender')
const config = require('../server/config')

let messageReceiver
let messageSender
const address = 'test-receive'

const message = {
  content: 'hello'
}

describe.skip('message receiver', () => {
  beforeAll(() => {
    ServiceBusClientMock.createFromConnectionString.mockImplementation(() => mockSBClient)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await messageReceiver.closeConnection()
    await messageSender.closeConnection()
  })

  test('message receiver can receive messages', async () => {
    expect.assertions(1)
    let done
    const promise = new Promise((resolve) => {
      done = resolve
    })
    const testConfig = { ...config.messageQueues.claimQueue, address }
    messageReceiver = new MessageReceiver('test-receiver', testConfig)
    await messageReceiver.setupReceiver((result) => done(result.hello === message.hello))

    messageSender = new MessageSender('test-sender', testConfig)
    await messageSender.sendMessage(message)

    console.log('end of function')
    return expect(promise).resolves.toEqual(true)
  })
})
