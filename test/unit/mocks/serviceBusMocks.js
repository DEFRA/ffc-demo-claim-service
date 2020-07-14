jest.mock('@azure/service-bus')
const { ServiceBusClient: ServiceBusClientMock } = require('@azure/service-bus')

const mockReceiver = (receiveMode) => {
  return {
    registerMessageHandler: jest.fn((onMessage, onError) => {})
  }
}

const mockQueueClient = (address) => {
  return {
    createReceiver: jest.fn((receiveMode) => mockReceiver(receiveMode)),
    createSender: jest.fn(() => mockSender)
  }
}

const mockSBClient = {
  close: jest.fn(async () => {}),
  createQueueClient: jest.fn(address => mockQueueClient(address))
}

const mockSend = jest.fn(async () => {})

const mockSender = {
  close: () => {},
  send: mockSend
}

module.exports = {
  mockSBClient,
  mockSender,
  mockSend,
  ServiceBusClientMock
}
