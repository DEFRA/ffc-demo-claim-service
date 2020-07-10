const { ServiceBusClient } = require('@azure/service-bus')
const { loginWithUsernamePassword } = require('@azure/ms-rest-nodeauth')

class MessageBase {
  constructor (name, config) {
    this.name = name
    this.createClient(config)
  }

  createClient (config) {
    this.sbClient = config.username ? this.createClientFromUserToken(config) : this.createClientFromPodIdentityToken(config)
  }

  async createClientFromUserToken (config) {
    const credentials = await loginWithUsernamePassword(config.username, config.password, {
      tokenAudience: `https://${config.host}/`
    })
    return ServiceBusClient.createFromAadTokenCredentials(config.host, credentials)
  }

  createClientFromPodIdentityToken (config) {
    // TODO add Azure Pod Identity logic
  }

  async closeConnection () {
    await this.sbClient.close()
    console.log(`${this.name} connection closed`)
  }
}

module.exports = MessageBase
