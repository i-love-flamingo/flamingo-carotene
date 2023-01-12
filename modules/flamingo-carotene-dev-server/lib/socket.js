class Socket {
  constructor (core) {
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
    this.io = null
    core.getJobmanager().setReportCallback(this.report.bind(this))
  }

  init () {
    if (this.io) {
      return
    }

    const { Server } = require('socket.io')
    this.io = new Server(this.config.devServer.port, {
      allowEIO3: true,
      cors: {
        origin: true,
        credentials: true
      }
    })

    this.io.on('connection', () => {
      this.io.emit('connected', this.config.devServer)
    })
  }

  report (reportData) {
    if (this.io) {
      this.io.emit('report', reportData)
    }
  }

  reportBuildOutput (output) {
    if (this.io) {
      this.io.emit('buildOutput', output)
    }
  }

  emit (eventName, eventData) {
    this.io.emit(eventName, eventData)
  }
}

module.exports = Socket
