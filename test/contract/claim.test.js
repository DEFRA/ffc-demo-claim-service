const path = require('path')
const { MessageConsumerPact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
const { claimMessageAction } = require('../../server/services/message-action')
const dbHelper = require('../db-helper')
const { publishClaim } = require('../../server/services/message-service')

describe('Receiving a new claim', () => {
  let messagePact

  beforeAll(async () => {
    await dbHelper.truncate()

    messagePact = new MessageConsumerPact({
      consumer: 'ffc-demo-claim-service',
      provider: 'ffc-demo-web',
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
  })

  afterAll(() => {
    dbHelper.close()
  })

  test('messageAction can process message', async () => {
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
      .verify(message => claimMessageAction(message.contents, publishClaim))
  })
})
