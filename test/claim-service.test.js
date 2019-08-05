
describe('Test claim service', () => {
  let claimService
  let claimRepositoryMock
  let minetypeRepositoryMock
  let messageServiceMock

  beforeEach(async () => {
    claimRepositoryMock = require('../server/repository/claim-repository')
    minetypeRepositoryMock = require('../server/repository/minetype-repository')
    messageServiceMock = require('../server/services/message-service')
    jest.mock('../server/repository/claim-repository')
    jest.mock('../server/repository/minetype-repository')
    jest.mock('../server/services/message-service')

    claimService = require('../server/services/claim-service')
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
    return expect(claimRepositoryMock.create).toHaveBeenCalledTimes(1)
  })

  test('Claim service create works with existing claim', async () => {
    claimRepositoryMock.getById.mockResolvedValue({})
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    await claimService.create(claimRecord)
    return expect(claimRepositoryMock.create).toHaveBeenCalledTimes(0)
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
    return expect(minetypeRepositoryMock.create).toHaveBeenCalledTimes(2)
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
    return expect(messageServiceMock.publishClaim).toHaveBeenCalledTimes(1)
  })

  afterEach(async () => {
    jest.unmock('../server/repository/claim-repository')
    jest.unmock('../server/repository/minetype-repository')
    jest.unmock('../server/services/message-service')
  })
})
