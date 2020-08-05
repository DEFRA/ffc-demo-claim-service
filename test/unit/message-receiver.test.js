const auth = require('@azure/ms-rest-nodeauth')
const MessageReceiver = require('../../server/services/messaging/message-receiver')

describe('MessageReceiver test', () => {
  const name = 'test-message-receiver'
  const config = { host: 'test-host' }

  test('construct a new MessageReceiver from connection string', () => {
    const messageReceiver = new MessageReceiver(name, config)

    expect(messageReceiver).not.toBeNull()
    expect(messageReceiver.name).toEqual(name)
    expect(messageReceiver.sbClient).toBeDefined()
    expect(messageReceiver.queueClient).toBeDefined()
    expect(messageReceiver.sbClient._context.tokenProvider.namespace).toEqual(`sb://${config.host}/`)
    expect(messageReceiver.sbClient._context.tokenProvider._credentials).toBeUndefined()
  })

  test('construct a new MessageReceiver from AAD Token Credentials', () => {
    const creds = new auth.MSIVmTokenCredentials()
    const messageReceiver = new MessageReceiver(name, config, creds)

    expect(messageReceiver).not.toBeNull()
    expect(messageReceiver.name).toEqual(name)
    expect(messageReceiver.sbClient).toBeDefined()
    expect(messageReceiver.queueClient).toBeDefined()
    expect(messageReceiver.sbClient._context.tokenProvider.namespace).toBeUndefined()
    expect(messageReceiver.sbClient._context.tokenProvider._credentials).toBeDefined()
  })

  test('receiverHandler calls action', async () => {
    const mockAction = jest.fn()
    const messageReceiver = new MessageReceiver(name, config, undefined, mockAction)

    const body = { hello: 'world' }
    const msg = { body }
    await messageReceiver.receiverHandler(msg)

    expect(mockAction).toHaveBeenCalledTimes(1)
    expect(mockAction).toHaveBeenCalledWith(body)
  })
})
