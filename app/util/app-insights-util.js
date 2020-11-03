const appInsights = require('applicationinsights')

module.exports = {
  setSessionId: (correlationId) => {
    const sessionIdTag = appInsights.defaultClient.context.keys.sessionId
    appInsights.defaultClient.context.tags[sessionIdTag] = correlationId
  },
  getSessionId: (correlationId) => {
    const sessionIdTag = appInsights.defaultClient.context.keys.sessionId
    return appInsights.defaultClient.context.tags[sessionIdTag]
  },
  logTraceMessage: (message) => {
    appInsights.defaultClient.trackTrace({ message })
  }
}
