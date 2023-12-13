const index = require('../../../../app/messaging/inbox/index')

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
      }
    }
  }
})
require('../../../../app/config')

jest.mock('../../../../app/messaging/inbox/process-claim-message', () => {
  return jest.fn()
})
const processClaimMessage = require('../../../../app/messaging/inbox/process-claim-message')

jest.mock('adp-messaging')
const { MessageReceiver } = require('adp-messaging')
MessageReceiver.mockImplementation(() => {
  return {
    subscribe: jest.fn(),
    closeConnection: jest.fn()
  }
})

describe('index', () => {
  let claimReceiver

  beforeEach(() => {
    claimReceiver = new MessageReceiver()
    MessageReceiver.mockImplementation(() => claimReceiver)
  })

  test('should start the inbox service - expect claimReceiver.subscribe called', async () => {
    await index.start()
    expect(claimReceiver.subscribe).toHaveBeenCalled()
  })

  test('should stop the inbox service', async () => {
    await index.stop()
    expect(claimReceiver.closeConnection).toHaveBeenCalled()
  })
})
