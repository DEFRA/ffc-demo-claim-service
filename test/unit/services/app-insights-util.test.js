let mockAppInsights
let appInsightUtil

describe('App Insights Util', () => {
  beforeEach(() => {
    jest.mock('applicationinsights', () => ({
      defaultClient: {
        trackTrace: jest.fn(),
        context: {
          keys: {
            sessionId: 'ai.session.id'
          },
          tags: {}
        }
      }
    }))

    mockAppInsights = require('applicationinsights')
    appInsightUtil = require('../../../app/util/app-insights-util')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('ai.session.id not set, matches undefined', async () => {
    expect(mockAppInsights.defaultClient.context.tags['ai.session.id']).toBe(undefined)
  })

  test('setSessionId updates session Id to match correlation Id', async () => {
    const testCorrelationId = 'd79dd6fe-72fc-43a8-b4c4-ec9c6bc7db9d'
    appInsightUtil.setSessionId(testCorrelationId)
    expect(mockAppInsights.defaultClient.context.tags['ai.session.id']).toBe(testCorrelationId)
  })

  test('getSessionId retrieves the session Id to match correlation Id', async () => {
    const testCorrelationId = 'd79dd6fe-72fc-43a8-b4c4-ec9c6bc7db9d'
    appInsightUtil.setSessionId(testCorrelationId)
    expect(mockAppInsights.defaultClient.context.tags['ai.session.id']).toBe(appInsightUtil.getSessionId())
  })

  test('logTraceMessage calls trace function', async () => {
    appInsightUtil.logTraceMessage('Trace Sender - ffc-demo-claim-service: demo-claim-service-sender')
    expect(mockAppInsights.defaultClient.trackTrace).toHaveBeenCalledTimes(1)
  })
})
