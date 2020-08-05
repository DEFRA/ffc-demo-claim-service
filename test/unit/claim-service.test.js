describe('Test claim service', () => {
  let claimService
  let mockClaimRepository
  let mockMinetypeRepository

  beforeAll(async () => {
    jest.mock('../../server/repository/claim-repository', () => ({
      getById: jest.fn(),
      create: jest.fn()
    }))
    jest.mock('../../server/repository/minetype-repository', () => ({
      create: jest.fn()
    }))
  })

  beforeEach(async () => {
    jest.resetModules()
    mockClaimRepository = require('../../server/repository/claim-repository')
    mockMinetypeRepository = require('../../server/repository/minetype-repository')
    claimService = require('../../server/services/claim-service')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Claim service create works with new claim', async () => {
    const claimRecord = getSampleClaim()
    await claimService.create(claimRecord, () => {})
    expect(mockClaimRepository.create).toHaveBeenCalledTimes(1)
    expect(mockClaimRepository.create).lastCalledWith(claimRecord)
  })

  test('Claim service create works with existing claim', async () => {
    mockClaimRepository.getById.mockResolvedValue({})
    const claimRecord = getSampleClaim()
    await claimService.create(claimRecord, () => {})
    expect(mockClaimRepository.create).toHaveBeenCalledTimes(0)
  })

  test('Claim service gets details of mine types from mine type repository', async () => {
    const claimRecord = getSampleClaim()
    await claimService.create(claimRecord, () => {})
    expect(mockMinetypeRepository.create).toHaveBeenCalledTimes(2)
  })

  test('Claim service publishes the claim to the given publisher', async () => {
    const claimRecord = getSampleClaim()
    const publisher = jest.fn()
    await claimService.create(claimRecord, publisher)
    expect(publisher).toHaveBeenCalledWith(claimRecord)
  })

  afterAll(async () => {
    jest.unmock('../../server/repository/claim-repository')
    jest.unmock('../../server/repository/minetype-repository')
  })

  const getSampleClaim = () => ({
    claimId: 'MINE123',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: new Date(),
    mineType: ['gold', 'iron']
  })
})
