const appInsights = require('applicationinsights')

module.exports = {
  setSessionId: (correlationId) => {
    if (appInsights.defaultClient !== null && appInsights.defaultClient !== undefined) {
      const sessionIdTag = appInsights.defaultClient.context.keys.sessionId
      appInsights.defaultClient.context.tags[sessionIdTag] = correlationId
    }
  },
  getSessionId: (correlationId) => {
    if (appInsights.defaultClient !== null && appInsights.defaultClient !== undefined) {
      const sessionIdTag = appInsights.defaultClient.context.keys.sessionId
      return appInsights.defaultClient.context.tags[sessionIdTag]
    }
    return null
  },
  logTraceMessage: (message) => {
    if (appInsights.defaultClient !== null && appInsights.defaultClient !== undefined) {
      appInsights.defaultClient.trackTrace({ message })
    }
  }
}
