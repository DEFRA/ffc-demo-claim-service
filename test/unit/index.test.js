jest.mock('../../app/services/app-insights', () => ({
  setup: jest.fn()
}))
require('../../app/services/app-insights')

jest.mock('../../app/messaging/inbox', () => ({
  start: jest.fn().mockResolvedValue(),
  stop: jest.fn().mockResolvedValue()
}))
require('../../app/messaging/inbox')

jest.mock('../../app/messaging/outbox', () => ({
  start: jest.fn().mockResolvedValue(),
  stop: jest.fn().mockResolvedValue()
}))
require('../../app/messaging/outbox')

describe('Index', () => {
  let exitSpy
  beforeEach(() => {
    jest.resetModules()
    jest.resetAllMocks()
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})
  })

  afterEach(() => {
    exitSpy.mockRestore()
  })

  test('should start the service', async () => {
    jest.isolateModules(() => {
      require('../../app/index')
    })
    await new Promise((resolve) => setImmediate(resolve))
  })

  test('should stop the service on SIGTERM', async () => {
    jest.isolateModules(() => {
      require('../../app/index')
    })
    await new Promise((resolve) => setImmediate(resolve))
    process.emit('SIGTERM')
  })

  test('should stop the service on SIGINT', async () => {
    jest.isolateModules(() => {
      require('../../app/index')
    })
    await new Promise((resolve) => setImmediate(resolve))
    process.emit('SIGINT')
  })
})
