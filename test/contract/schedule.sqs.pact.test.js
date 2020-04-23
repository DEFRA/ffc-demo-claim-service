describe('Pact Verification', () => {
  const { MessageProviderPact } = require('@pact-foundation/pact')
  const { getScheduleMessage } = require('../../server/services/message-service')
  const path = require('path')

  test('validates the expectations of ffc-demo-payment-service', () => {
    const claim = {
      claimId: 'MINE123',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: '2019-07-26T09:54:19.622Z',
      mineType: ['gold']
    }

    const provider = new MessageProviderPact({
      messageProviders: {
        'a request for new payment schedule': () => getScheduleMessage(claim)
      },
      provider: 'ffc-demo-claim-service',
      pactUrls: [
        path.resolve(__dirname, './pacts/ffc-demo-payment-service-ffc-demo-claim-service.json')
      ]
    })

    return provider.verify()
  })
})
