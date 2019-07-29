const rhea = jest.genMockFromModule('rhea-promise')

const mockDelivery = jest.fn().mockImplementation(() => {
  return {
    settled: true
  }
})

const mockClose = jest.fn()
const mockOpen = jest.fn()
const mockSend = jest.fn(function () {
  return new mockDelivery()
})

const mockSender = jest.fn().mockImplementation(() => {
  return {
    close: mockClose,
    send: mockSend,
  }
})

const mockCreateSender = jest.fn(function () {
  return new mockSender()
})

const mockConnection = jest.fn().mockImplementation(() => {
  return {
    close: mockClose,
    createSender: mockCreateSender,
    open: mockOpen
  }
})

rhea.Sender = mockSender
rhea.Connection = mockConnection
rhea.Delivery = mockDelivery
rhea._SendFunction = mockSend

module.exports = rhea
