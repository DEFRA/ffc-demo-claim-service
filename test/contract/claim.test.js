const path = require('path')
const { MessageConsumerPact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
const createClaim = require('../../app/services/create-claim')
const dbHelper = require('../db-helper')

describe('receiving a new claim', () => {
  let messagePact

  beforeAll(async () => {
    await dbHelper.truncate()
    messagePact = new MessageConsumerPact({
      consumer: 'ffc-demo-claim-service',
      provider: 'ffc-demo-web',
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output')
    })
  }, 30000)

  afterAll(async () => {
    await dbHelper.truncate()
    await dbHelper.close()
  }, 30000)

  test('new claim is received and saved', async () => {
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
      .verify(async message => createClaim(message.contents))
  })
})
