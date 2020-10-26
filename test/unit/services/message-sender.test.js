const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('../../../app/services/messaging/message-sender')

describe('MessageSender test', () => {
  const name = 'test-message-sender'
  const config = { host: 'test-host' }

  test('construct a new MessageSender from connection string', () => {
    const messageSender = new MessageSender(name, config)

    expect(messageSender).not.toBeNull()
    expect(messageSender.name).toEqual(name)
    expect(messageSender.sbClient).toBeDefined()
    expect(messageSender.queueClient).toBeDefined()
    expect(messageSender.sbClient._context.tokenProvider.namespace).toEqual(`sb://${config.host}/`)
    expect(messageSender.sbClient._context.tokenProvider._credentials).toBeUndefined()
  })

  test('construct a new MessageSender from AAD Token Credentials', () => {
    const creds = new auth.MSIVmTokenCredentials()
    const messageSender = new MessageSender(name, config, creds)

    expect(messageSender).not.toBeNull()
    expect(messageSender.name).toEqual(name)
    expect(messageSender.sbClient).toBeDefined()
    expect(messageSender.queueClient).toBeDefined()
    expect(messageSender.sbClient._context.tokenProvider.namespace).toBeUndefined()
    expect(messageSender.sbClient._context.tokenProvider._credentials).toBeDefined()
  })

  test('can send a message', async () => {
    const messageSender = new MessageSender(name, config)
    const closeMock = jest.fn()
    const sendMock = jest.fn()
    const senderMock = jest.fn(() => { return { close: closeMock, send: sendMock } })
    messageSender.queueClient.createSender = senderMock

    const msg = { hello: 'world' }
    const message = await messageSender.sendMessage(msg)

    expect(message).toEqual(msg)
    expect(senderMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledTimes(1)
    expect(sendMock).toHaveBeenCalledWith({ body: msg })
    expect(closeMock).toHaveBeenCalledTimes(1)
  })
})
