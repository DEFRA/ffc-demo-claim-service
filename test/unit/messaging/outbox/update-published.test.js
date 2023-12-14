const updatePublished = require('../../../../app/messaging/outbox/update-published')

jest.mock('../../../../app/services/database-service', () => {
  const mockDatabaseService = {
    models: {
      outbox: {
        update: jest.fn()
      }
    }
  }
  return () => mockDatabaseService
})

describe('update published', () => {
  let mockDatabaseService

  beforeEach(() => {
    const databaseService = require('../../../../app/services/database-service')
    mockDatabaseService = databaseService()
    jest.clearAllMocks()
  })
  test('should update a claim to published', async () => {
    await updatePublished('claim101')
    expect(mockDatabaseService.models.outbox.update).toHaveBeenCalled()
  })
})
