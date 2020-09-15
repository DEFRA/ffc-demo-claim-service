const MessageReceiver = require('../../../server/services/messaging/message-receiver')
const MessageSender = require('../../../server/services/messaging/message-sender')
const config = require('../../../server/config')

let messageReceiver
let messageSender

const message = {
  content: 'hello'
}

describe('message receiver', () => {
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
    const testConfig = { ...config.messageQueues.claimQueue }
    const action = (result) => {
      done(result.hello === message.hello)
    }

    messageReceiver = new MessageReceiver('message-receiver-test-receiver', testConfig, undefined, action)

    messageSender = new MessageSender('message-receiver-test-sender', testConfig)
    await messageSender.sendMessage(message)

    return expect(promise).resolves.toEqual(true)
  })
})
