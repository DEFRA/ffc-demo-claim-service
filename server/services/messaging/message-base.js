const { ServiceBusClient } = require('@azure/service-bus')

class MessageBase {
  constructor (name, config) {
    this.name = name
    this.config = config
    this.createClient()
  }

  createClient () {
    this.sbClient = this.config.username ? this.createClientFromConnectionString(this.config) : this.createClientFromAADToken(this.config)
  }

  createClientFromConnectionString (config) {
    const connectionString = `Endpoint=sb://${config.host}/;SharedAccessKeyName=${config.username};SharedAccessKey=${config.password}`
    return ServiceBusClient.createFromConnectionString(connectionString)
  }

  createClientFromAADToken (config) {
    // TODO add Azure Pod Identity logic
  }

  async closeConnection () {
    await this.sbClient.close()
    console.log(`${this.name} connection closed`)
  }
}

module.exports = MessageBase
