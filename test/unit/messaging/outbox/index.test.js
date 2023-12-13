const index = require('../../../../app/messaging/outbox/index')
jest.mock('../../../../app/config', () => {
  return {
    messageQueues: {
      claimQueue: {
        name: 'test-queue',
        address: 'address',
        username: 'username',
        password: 'password',
        type: 'queue',
        host: 'localhost',
        useCredentialChain: false,
        managedIdentityClientId: 'asdf',
        appInsights: undefined
      },
      calculationQueue: {
        name: 'test-queue',
        address: 'address',
        username: 'username',
        password: 'password',
        type: 'queue',
        host: 'localhost',
        useCredentialChain: false,
        managedIdentityClientId: 'asdf',
        appInsights: undefined
      },
      scheduleTopic: {
        name: 'test-topic',
        address: 'address',
        username: 'username',
        password: 'password',
        type: 'topic',
        host: 'localhost',
        useCredentialChain: false,
        managedIdentityClientId: 'asdf',
        appInsights: undefined
      }
    }
  }
})
require('../../../../app/config')

jest.mock('adp-messaging')
const { MessageSender } = require('adp-messaging')
MessageSender.mockImplementation(() => {
  return {
    closeConnection: jest.fn()
  }
})

jest.mock('../../../../app/messaging/outbox/publish-pending', () => {
  return jest.fn()
})
const publishPendingClaims = require('../../../../app/messaging/outbox/publish-pending')

describe('index', () => {
  let sender

  beforeEach(() => {
    sender = new MessageSender()
    MessageSender.mockImplementation(() => sender)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('should start the outbox service', async () => {
    await index.start()
    jest.runOnlyPendingTimers()
    expect(publishPendingClaims).toHaveBeenCalled()
  })

  test('should stop the outbox service', async () => {
    await index.stop()
    expect(sender.closeConnection).toHaveBeenCalledTimes(2)
  })
})
