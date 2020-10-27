const appInsightsService = (appInsightClient) => {
  const setOperationId = (correlationId) => {
    if (appInsightClient !== null && appInsightClient !== undefined) {
      const operationIdTag = appInsightClient.context.keys.operationId
      appInsightClient.context.tags[operationIdTag] = correlationId
    }
  }

  const getOperationId = () => {
    if (appInsightClient !== null && appInsightClient !== undefined) {
      const operationIdTag = appInsightClient.context.keys.operationId
      return appInsightClient.context.tags[operationIdTag]
    }
    return null
  }

  const logTraceMessage = (message) => {
    if (appInsightClient !== null && appInsightClient !== undefined) {
      appInsightClient.trackTrace({ message: message })
    }
  }

  return {
    setOperationId,
    getOperationId,
    logTraceMessage
  }
}

module.exports = appInsightsService
