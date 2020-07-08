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

const mockSbClient = {
  close: jest.fn(async () => {}),
  createQueueClient: jest.fn(address => mockQueueClient(address))
}

const mockSend = jest.fn(async () => {})

const mockSender = {
  close: () => {},
  send: mockSend
}

module.exports = {
  mockSbClient,
  mockSender,
  mockSend
}
