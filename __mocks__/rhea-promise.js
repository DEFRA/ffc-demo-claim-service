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

const mockCreateSender = jest.fn(function () {
  return new MockSender()
})

const mockConnection = jest.fn().mockImplementation(() => {
  return {
    close: mockClose,
    createSender: mockCreateSender,
    open: mockOpen
  }
})

rhea.Sender = MockSender
rhea.Connection = mockConnection
rhea.Delivery = MockDelivery
rhea._SendFunction = mockSend

module.exports = rhea
