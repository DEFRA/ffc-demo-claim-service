describe('Test claim message action', () => {
  let mockClaimService
  let action
  let claimSchema

  beforeAll(async () => {
    jest.mock('../../../server/services/claim-service', () => ({
      create: jest.fn()
    }))
    jest.mock('../../../server/schema/claimFromMessage', () => ({
      validateAsync: jest.fn()
    }))
  })

  beforeEach(async () => {
    jest.resetModules()
    mockClaimService = require('../../../server/services/claim-service')
    action = require('../../../server/services/message-action')
    claimSchema = require('../../../server/schema/claimFromMessage')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('Well formed message results in call to claimService', async () => {
    const claim = generateSampleClaim()
    await action.claimMessageAction(claim)
    expect(mockClaimService.create).toHaveBeenCalledTimes(1)
  })

  test('Badly formed message results in no call to claimService', async () => {
    const claim = generateSampleClaim()
    delete claim.email
    claimSchema.validateAsync.mockRejectedValueOnce(claim)
    await action.claimMessageAction(claim)
    expect(mockClaimService.create).toHaveBeenCalledTimes(0)
  })

  test('Passes publisher to claim service', async () => {
    const publisher = () => {}
    await action.claimMessageAction(generateSampleClaim(), publisher)
    expect(mockClaimService.create).toHaveBeenCalledWith(
      expect.any(Object),
      publisher
    )
  })

  const generateSampleClaim = () => ({
    claimId: 'MINE123',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: new Date(),
    mineType: ['gold', 'iron'],
    email: 'joe.bloggs@defra.gov.uk'
  })
})
