const rhea = jest.genMockFromModule('rhea-promise')

const MockDelivery = jest.fn().mockImplementation(() => {
  return {
    settled: true
  }
})

const mockClose = jest.fn()
const mockOpen = jest.fn()
const mockSend = jest.fn(function () {
  return new MockDelivery()
})

const MockSender = jest.fn().mockImplementation(() => {
  return {
    close: mockClose,
    send: mockSend
  }
})

const mockCreateSender = jest.fn(() => {
  return new MockSender()
})

const MockConnection = jest.fn().mockImplementation(() => {
  return {
    close: mockClose,
    createAwaitableSender: mockCreateSender,
    open: mockOpen,
    isOpen: () => true
  }
})

const MockContainer = jest.fn().mockImplementation(() => {
  return {
    createConnection: () => new MockConnection()
  }
})

rhea.Sender = MockSender
rhea.Delivery = MockDelivery
rhea._SendFunction = mockSend
rhea.Container = MockContainer

module.exports = rhea
