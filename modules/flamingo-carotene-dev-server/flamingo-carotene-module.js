const fs = require('fs')
const path = require('path')

class DevServer {
  constructor (core) {
    this.modules = core.getModules()
    this.watchers = [] // List of all flamingoWatcher Classes.
    this.watcherConfigs = null

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

          config.devServer = {
            port: 3000,
            watcherConfig: {
              ignored: /(^|[/\\])\../ // dot files or folders
            }
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
        priority: 10,
        handler: (core) => {
          // This will add the socket client to the js entries in the webpack config and force a rebuild when the actual
          // build of the js has not already included the client, so that as soon as the dev command is ready, the
          // socket will be too. This will only be done if the command of the js watcher is available in the projects
          // watcher configs.

          const jsWatcherCommand = 'watchWebpackJs'

          const watcherConfigs = this.getWatcherConfigs()

          let jsWatcherFound = false

          for (const watcherConfig of watcherConfigs) {
            if (watcherConfig.command !== jsWatcherCommand) {
              continue
            }

            jsWatcherFound = true
            break
          }

          if (!jsWatcherFound) {
            return
          }

          const config = core.getConfig()

          const devBuildIndicator = path.join(config.paths.dist, 'isDevBuild')

          if (!fs.existsSync(devBuildIndicator)) {
            core.getCliTools().info(`Rebuilding JS to inject socketClient...`)

            core.getDispatcher().dispatchCommand(jsWatcherCommand)
            fs.writeFileSync(devBuildIndicator, '\r')
          }

          // Inject socket client into js entry
          const entryNames = Object.keys(config.webpackConfig.entry)
          for (const entryName of entryNames) {
            // Add the socket client to the beginning of every multi file entry
            if (Array.isArray(config.webpackConfig.entry[entryName])) {
              config.webpackConfig.entry[entryName].unshift(
                path.join(__dirname, 'lib', 'socketClient.js')
              )
            }
          }
          core.getCliTools().info(`Waiting for a filechange...`)
        }
      },
      {
        command: 'dev',
        handler: (core) => {
          const Socket = require('./lib/socket.js')
          const socket = new Socket(core)
          socket.init()

          const watcherConfigs = this.getWatcherConfigs()

          for (const watcherConfig of watcherConfigs) {
            const FileWatcher = require('./lib/fileWatcher.js')
            this.watchers.push(new FileWatcher(socket, core, watcherConfig))
          }
        }
      }
    ]
  }

  getWatcherConfigs () {
    if (this.watcherConfigs) {
      return this.watcherConfigs
    }

    const watchers = []

    for (const module of this.modules) {
      if (typeof module.getWatchers !== 'function') {
        continue
      }

      const moduleWatchers = module.getWatchers()
      watchers.push(...moduleWatchers)
    }

    this.watcherConfigs = watchers

    return watchers
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = DevServer
