
describe('Test claim service', () => {
  let claimService
  let claimRepositoryMock
  let minetypeRepositoryMock
  let messageServiceMock

//  const claimServiceMock = require('./services/claim-service-mock')
  const

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
    const claim = await claimService.create(claimRecord)
    await expect(claimRepositoryMock.create).toHaveBeenCalledTimes(1)
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
    const claim = await claimService.create(claimRecord)
    await expect(claimRepositoryMock.create).toHaveBeenCalledTimes(0)
  })

  afterEach(async () => {
    jest.unmock('../server/repository/claim-repository')
    jest.unmock('../server/repository/minetype-repository')
    jest.unmock('../server/services/message-service')
  })

  // test('Claim service create works with new claim', async () => {
  //   const claimService = proxyquire('../server/services/claim-service', {
  //     '../repository/claim-repository.js': claimRepositoryMock.new,
  //     '../repository/minetype-repository.js': minetypeRepositoryMock,
  //     '../services/message-service.js': messageServiceMock
  //   })
  //   sandbox.stub(claimRepositoryMock.existing, 'create').throws('should not be called')
//
  //   const claimRecord = {
  //     claimId: 'MINE123',
  //     propertyType: 'business',
  //     accessible: false,
  //     dateOfSubsidence: new Date(),
  //     mineType: ['gold', 'iron']
  //   }
  //   const claim = await claimService.create(claimRecord)
  //   expect(claimRepositoryMock.existing.create.callCount === 0)
  // })
//
//    afterEach(async () => {
//    })

})

// describe('Message test', () => {
//   let container
//   let listener
//
//   beforeEach(async () => {
//   })
//
//   test('Can send message', async () => {
//
//   })
//
//   afterEach(async () => {
//   })
// })
