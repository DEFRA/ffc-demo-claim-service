const rheaPromise = require('rhea-promise')

class MessageBase {
  constructor (name, config) {
    this.name = name
    const container = new rheaPromise.Container()
    this.connection = container.createConnection(config)
  }

  async openConnection () {
    try {
      await this.connection.open()
      console.log(`${this.name} connection opened`)
    } catch (error) {
      console.error(`error opening ${this.name} connection`, error)
      throw error
    }
  }

  async closeConnection () {
    await this.connection.close()
    console.log(`${this.name} connection closed`)
  }

  isConnected () {
    return this.connection.isOpen()
  }
}

module.exports = MessageBase
