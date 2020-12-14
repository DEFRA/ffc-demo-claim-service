const dbHelper = require('../../../db-helper')
const { MessageSender } = require('ffc-messaging')
const { models } = require('../../../../app/services/database-service')()
const mqConfig = require('../../../../app/config').messageQueues
const mockSendEmail = jest.fn()
jest.mock('notifications-node-client', () => {
  return {
    NotifyClient: jest.fn().mockImplementation(() => {
      return { sendEmail: mockSendEmail }
    })
  }
})
const publishPendingClaims = require('../../../../app/messaging/outbox/publish-pending')
let calculationSender
let scheduleSender

describe('get pending claims', () => {
  const claims = [{
    claimId: 'MINE1',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }, {
    claimId: 'MINE2',
    propertyType: 'business',
    accessible: false,
    dateOfSubsidence: '2019-07-26T09:54:19.622Z',
    mineType: ['gold', 'silver'],
    email: 'joe.bloggs@defra.gov.uk'
  }]

  const outbox = [{
    claimId: 'MINE1',
    published: true
  }, {
    claimId: 'MINE2',
    published: false
  }]

  beforeAll(async () => {
    await dbHelper.truncate()
    await dbHelper.createClaimRecords(claims)
    await dbHelper.createOutboxRecords(outbox)
    calculationSender = new MessageSender(mqConfig.calculationQueue)
    await calculationSender.connect()
    scheduleSender = new MessageSender(mqConfig.scheduleTopic)
    await scheduleSender.connect()
  })

  afterAll(async () => {
    await dbHelper.truncate()
    await dbHelper.close()
    await calculationSender.closeConnection()
    await scheduleSender.closeConnection()
  })

  test('should update published', async () => {
    await publishPendingClaims(calculationSender, scheduleSender)
    const pending = await models.outbox.findAll({ where: { published: false }, raw: true })
    expect(pending.length).toBe(0)
  })

  test('should send email via Notify', async () => {
    await publishPendingClaims(calculationSender, scheduleSender)

    expect(mockSendEmail).toHaveBeenCalledTimes(1)
    expect(mockSendEmail.mock.calls[0][2].personalisation.claimId).toBe('MINE2')
  })
})
