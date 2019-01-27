class Socket {
  constructor (core) {
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
    this.io = null
  }

  init () {
    if (this.io) {
      return
    }

    this.io = require('socket.io')()

    // this.io.on('connection', (client) => {
    //   console.info(`Connected to client: ${client.id}`)
    // })

    this.io.listen(this.config.devServer.port)
  }

  emit (eventName, eventData) {
    this.io.emit(eventName, eventData)
  }
}

module.exports = Socket
