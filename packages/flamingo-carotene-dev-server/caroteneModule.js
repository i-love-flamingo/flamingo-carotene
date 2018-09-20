const io = require('socket.io')()
const FlamingoWatcher = require('./lib/flamingoWatcher')

class CaroteneDevServer {
  constructor (core) {
    this.core = core
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
    this.dispatcher = null // Get dispatcher after module initialization!! Currently the dispatcher initializes all modules and would step into infinite loop
    this.watcherList = [] // List of all flamingoWatcher Classes.

    this.listeners = [
      {
        command: 'config',
        priority: 10,
        handler: function (core) {
          const command = core.getCliTools().getCommand()

          // Set environment to development
          if (command === 'dev') {
            process.env.NODE_ENV = 'development'
          }
        }
      },
      {
        command: 'dev',
        handler: (core) => {
          const watcherConfigList = this.getWatcherConfiguration();

          io.on('connection', (client) => {
            // console.info(`Connected to client: ${client.id}`)
          })
          io.listen(3000)

          for (const watcherConfig of watcherConfigList) {
            this.watcherList.push(new FlamingoWatcher(this, this.core, watcherConfig.watchId, watcherConfig.path, watcherConfig.command, watcherConfig.callbackKey))
          }
        }
      }
    ]
  }

  getWatcherConfiguration () {
    const modules = this.core.getModules()
    let watcherList = []
    for (const module of modules) {
      if (typeof module.getWatcherForDevServer === 'function') {
        const watcher = module.getWatcherForDevServer()
        watcherList = [...watcherList, ...watcher];
      }
    }
    return watcherList
  }

  // report build state to client
  reportBuildStateToClient () {
    io.emit('built')
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = CaroteneDevServer