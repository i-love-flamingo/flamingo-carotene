const path = require('path')

class DevServerModule {
  constructor (core) {
    this.modules = core.getModules()
    this.watcherConfigs = null
    const that = this

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

          config.devServer = {
            port: 3000,
            useCaroteneDisplay: true,
            caroteneDisplayPosition: 'top',
            injectSocket: true,
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
        description: function () {
          // Collect all watchers to update set job description
          let desc = 'Start a watcher process, which watches filechanges, and start build target automaticly:\n'

          const config = core.getConfig()
          const watcherConfigs = that.getWatcherConfigs()
          for (const watcherConfig of watcherConfigs) {

            const basePath = config.paths.src
            for (let mypath of watcherConfig.path) {
              if (mypath.substr(0, basePath.length) === basePath) {
                mypath = mypath.substr(basePath.length)
              }
              desc += `- ${mypath}\n`
            }
          }
          return desc
        },
        handler: (core) => {
          // Start DevServer
          const DevServer = require('./lib/devServer.js')
          const devServer = new DevServer(core, this.getWatcherConfigs());

          let forceInject = false;
          if (core.getCliTools().hasOption(['--freshDevServerBuild'])) {
            forceInject = true // Include module dir to the rules so that separate so that files such as css or sass can be loaded
          }

          devServer.handleInitialBuild(forceInject)

        }
      },
      {
        command: 'config',
        priority: 9,
        handler: (core) => {
          const config = core.getConfig()

          // Include module dir to the rules so that separate so that files such as css or sass can be loaded
          config.webpack.rulesInclude = config.webpack.rulesInclude || []
          config.webpack.rulesInclude.unshift(path.join(__dirname, 'dist'))
        }
      }
    ]
  }

  /**
   * Get all watcher config objects of all active modules
   * @returns {[]}
   */
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

  getDictionaryOptions() {
    return [{
      option: '--verboseWatch',
      description: 'Display folders and globs to watch, displays reasons why build targets were called.'
    }, {
      option: '--freshDevServerBuild',
      description: 'Force DevServer to freshly build and inject Carotene-Client into frontend.'
    }]
  }
}

module.exports = DevServerModule
