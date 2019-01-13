const FileWatcher = require('./lib/fileWatcher')
const Socket = require('./lib/socket')

class DevServer {
  constructor (core) {
    this.core = core
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
    this.watcherList = [] // List of all flamingoWatcher Classes.

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

          config.devServer = {
            port: 3000
          }
        }
      },
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
          const socket = new Socket(core)
          socket.init()

          const watcherConfigList = this.getWatcherConfiguration()

          for (const watcherConfig of watcherConfigList) {
            this.watcherList.push(new FileWatcher(socket, core, watcherConfig))
          }
        }
      }
    ]
  }

  getWatcherConfiguration () {
    const modules = this.core.getModules()
    const watchers = []

    for (const module of modules) {
      if (typeof module.getWatcherForDevServer !== 'function') {
        continue
      }

      const moduleWatchers = module.getWatcherForDevServer()
      watchers.push(...moduleWatchers)
    }

    return watchers
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = DevServer
