const { MessageProviderPact } = require('@pact-foundation/pact')
const path = require('path')

describe('Pact Verification', () => {
  let messageService
  test('validates the expectations of ffc-demo-payment-service', async () => {
    messageService = await require('../../app/services/inbox-service')()

    const claim = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: '2019-07-26T09:54:19.622Z',
      mineType: ['gold']
    }

    const publishMessages = async () => (await messageService.publishClaim(claim))[0]
    const provider = new MessageProviderPact({
      messageProviders: {
        'a request for new payment schedule': publishMessages
      },
      provider: 'ffc-demo-claim-service',
      pactUrls: [
        path.resolve(__dirname, './pacts/ffc-demo-payment-service-ffc-demo-claim-service.json')
      ]
    })

    return provider.verify()
  })

  afterAll(async () => {
    await messageService.closeConnections()
  })
})
