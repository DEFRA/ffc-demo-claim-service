const createClaim = require('../../../../app/messaging/inbox/create-claim')
const databaseService = require('../../../../app/services/database-service')

jest.mock('../../../../app/services/database-service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        claims: {
          create: jest.fn(),
          findOne: jest.fn()
        },
        outbox: {
          create: jest.fn()
        },
        mineTypes: {
          create: jest.fn()
        }
      },
      sequelize: {
        transaction: jest.fn().mockImplementation((callback) => callback())
      }
    }
  })
})

describe('create claim', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a new claim if it not exists', async () => {
    const claim = {
      claimId: 'claim101',
      name: 'mine123',
      propertyType: 'home',
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: 'admin@admin.com',
      mineType: ['coal', 'gold']
    }
    databaseService().models.claims.findOne.mockResolvedValue(null)
    expect(await createClaim(claim)).toBeUndefined()
  })
})
