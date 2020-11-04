const inboxService = require('../../../app/services/inbox-service')
const asbHelper = require('../../asb-helper')
const dbHelper = require('../../db-helper')
const { MessageSender } = require('ffc-messaging')
const mqConfig = require('../../../app/config').messageQueues
const mockCreateClaim = jest.mock('../../../app/services/create-claim')
const waitForExpect = require('wait-for-expect')
let sender

describe('inbox service', () => {
  const message = {
    body: {
      claimId: 'MINE1',
      propertyType: 'business',
      accessible: false,
      dateOfSubsidence: '2019-07-26T09:54:19.622Z',
      mineType: ['gold', 'silver'],
      email: 'joe.bloggs@defra.gov.uk'
    },
    type: 'test.type',
    source: 'integration-tests'
  }

  beforeAll(async () => {
    await inboxService.start()
    sender = new MessageSender(mqConfig.claimQueue)
    await sender.connect()
    await sender.sendMessage(message)
  })

  beforeEach(async () => {
    await dbHelper.truncate()
    await asbHelper.clearQueue('claimQueue')
  })

  afterEach(async () => {
    await dbHelper.truncate()
  })

  afterAll(async () => {
    await inboxService.stop()
    await dbHelper.close()
  })

  test('should complete valid messages', async () => {
    waitForExpect.defaults.timeout = 19000
    await waitForExpect(() => {
      expect(mockCreateClaim.mock.calls).toBeDefined()
    })
  })
})
