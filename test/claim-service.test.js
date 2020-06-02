
describe('Test claim service', () => {
  let claimService
  let mockClaimRepository
  let mockMinetypeRepository
  let mockMessageService

  beforeAll(async () => {
    jest.mock('../server/repository/claim-repository')
    jest.mock('../server/repository/minetype-repository')
    jest.mock('../server/services/message-service')
  })

  beforeEach(async () => {
    jest.resetModules()
    mockClaimRepository = require('../server/repository/claim-repository')
    mockMinetypeRepository = require('../server/repository/minetype-repository')
    mockMessageService = require('../server/services/message-service')
    claimService = require('../server/services/claim-service')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Claim service create works with new claim', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    await claimService.create(claimRecord)
    expect(mockClaimRepository.create).toHaveBeenCalledTimes(1)
    expect(mockClaimRepository.create).lastCalledWith(claimRecord)
  })

  test('Claim service create works with existing claim', async () => {
    mockClaimRepository.getById.mockResolvedValue({})
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    await claimService.create(claimRecord)
    expect(mockClaimRepository.create).toHaveBeenCalledTimes(0)
  })

  test('Claim service gets details of mine types from mine type repository', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    await claimService.create(claimRecord)
    expect(mockMinetypeRepository.create).toHaveBeenCalledTimes(2)
  })

  test('Claim service publishes the claim to the message broker', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    await claimService.create(claimRecord)
    expect(mockMessageService.publishClaim).toHaveBeenCalledTimes(1)
  })

  afterAll(async () => {
    jest.unmock('../server/repository/claim-repository')
    jest.unmock('../server/repository/minetype-repository')
    jest.unmock('../server/services/message-service')
  })
})
