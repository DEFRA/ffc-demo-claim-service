let warned = false

function onSenderError (context, name) {
  const senderError = context.sender && context.sender.error
  if (senderError) {
    console.error(`sender error for ${name}`, senderError)
  }
}

function onSessionError (context, name) {
  const sessionError = context.session && context.session.error
  if (sessionError) {
    console.error(`session error for ${name}`, sessionError)
    if (!warned) {
      const sesionErrorWarning = new Error('AMQP session error')
      sesionErrorWarning.name = 'AMQPWarning'
      sesionErrorWarning.code = 'AMQP001'
      process.emitWarning(sesionErrorWarning)
      warned = true
    }
  }
}

function getSenderConfig (name, config) {
  return {
    name,
    target: { address: config.address },
    onError: (context) => onSenderError(context, name),
    onSessionError: (context) => onSessionError(context, name),
    sendTimeoutInSeconds: config.sendTimeoutInSeconds
  }
}

function getReceiverConfig (name, config) {
  return {
    name,
    source: { address: config.address },
    onSessionError: (context) => onSessionError(context, name)
  }
}

module.exports = {
  getReceiverConfig,
  getSenderConfig
}
