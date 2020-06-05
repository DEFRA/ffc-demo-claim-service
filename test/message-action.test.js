
describe('Test claim message action', () => {
  let mockClaimService
  let claimMessageAction

  beforeAll(async () => {
    jest.mock('../server/services/claim-service')
  })

  beforeEach(async () => {
    jest.resetModules()
    mockClaimService = require('../server/services/claim-service')
    claimMessageAction = require('../server/services/message-action')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Well formed message results in call to claimService', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron'],
      email: 'joe.bloggs@defra.gov.uk'
    }
    const message = { Body: JSON.stringify(claimRecord) }
    await claimMessageAction.claimMessageAction(message)
    expect(mockClaimService.create).toHaveBeenCalledTimes(1)
  })

  test('Badly formed message results in no call to claimService', async () => {
    const claimRecord = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: new Date(),
      mineType: ['gold', 'iron']
    }
    const message = { Body: JSON.stringify(claimRecord) }
    await claimMessageAction.claimMessageAction(message)
    expect(mockClaimService.create).toHaveBeenCalledTimes(0)
  })

  afterAll(async () => {
    jest.unmock('../server/services/claim-service')
  })
})
