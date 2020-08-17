const path = require('path')
const { MessageConsumerPact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
const asbHelper = require('../asb-helper')
const { claimMessageAction } = require('../../server/services/message-action')
const dbHelper = require('../db-helper')

describe('receiving a new claim', () => {
  let messagePact

  beforeAll(async () => {
    await asbHelper.clearAllQueues()
    await dbHelper.truncate()

    messagePact = new MessageConsumerPact({
      consumer: 'ffc-demo-claim-service',
      provider: 'ffc-demo-web',
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
  }, 30000)

  afterAll(async () => {
    await asbHelper.clearAllQueues()
    await dbHelper.close()
  }, 30000)

  test('new claim is received, saved and published to other services', async () => {
    const messageService = await require('../../server/services/message-service')()
    await messagePact
      .given('valid message')
      .expectsToReceive('a request for new claim')
      .withContent({
        claimId: Matchers.like('MINE123'),
        propertyType: Matchers.like('business'),
        dateOfSubsidence: Matchers.iso8601DateTime(),
        mineType: Matchers.like('["gold"]'),
        email: Matchers.email()
      })
      .withMetadata({
        'content-type': 'application/json'
      })
      .verify(async message => claimMessageAction(message.contents, messageService.publishClaim))
  })
})
