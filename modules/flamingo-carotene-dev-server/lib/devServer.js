const FileWatcher = require('./fileWatcher')
const AnsiConverter = require('ansi-to-html')
const path = require('path')
const fs = require('fs')

class DevServer {

  constructor(core, watcherConfigs) {
    this.socket = null
    this.watcherConfigs = watcherConfigs
    this.core = core
    this.config = this.core.getConfig()
    this.cliTools = core.getCliTools()
    this.watcher = []
    this.lastBuildTime = 0
    this.watcherVerbose = this.cliTools.hasOption('--verboseWatch')
  }

  beforeRunByChange() {
    this.cliTools.info(`DevServer beforeRunByChange`, !this.watcherVerbose)
    this.lastBuildTime = new Date()
    this.core.clearErrors()
    this.core.clearBuildNotes()
  }

  afterRunByChange() {
    this.cliTools.info(`DevServer afterRunByChange`, !this.watcherVerbose)
    if (this.core.hasErrors() || this.core.hasBuildNotes()) {
      const output = this.cliTools.getBufferAsString(this.lastBuildTime, function (message, type, verbose) {
        return `${message}\n`
      })
      const ansiConverter = new AnsiConverter({
        newline: true,
        escapeXML: true,
        // update colors to brighter version for better readability
        colors: {
          0: '#888',
          1: '#F88',
          2: '#8F8',
          3: '#FF8',
          4: '#88F',
          5: '#88F',
          6: '#8FF',
          7: '#DDD',
          8: '#AAA',
          9: '#FAA',
          10: '#AFA',
          11: '#FFA',
          12: '#AAF',
          13: '#AAF',
          14: '#AFF',
          15: '#FFF'
        }
      })
      this.socket.reportBuildOutput(ansiConverter.toHtml(output))
    }
  }


  handleInitialBuild(forceInject) {
    const jsBuildCommand = 'watchWebpackJs'
    const initialBuildJobManagerGroup = 'initialBuild'

    const watcherConfigs = this.watcherConfigs

    let jsBuildCommandFound = false

    for (const watcherConfig of watcherConfigs) {
      if (watcherConfig.command !== jsBuildCommand) {
        continue
      }
      jsBuildCommandFound = true
      break
    }

    if (!jsBuildCommandFound) {
      this.startWatch()
      return
    }

    const config = this.core.getConfig()
    const jobManager = this.core.getJobmanager()
    const devBuildIndicator = path.join(config.paths.dist, 'isDevBuild')

    // if injectSocket is set to false - dont do anything!
    if (!config.devServer.injectSocket && !forceInject) {
      startWatch()
      return
    }

    // Inject socket client into js entry
    const entryNames = Object.keys(config.webpackConfig.entry)
    for (const entryName of entryNames) {
      // Add the socket client to the beginning of every multi file entry
      if (Array.isArray(config.webpackConfig.entry[entryName])) {
        config.webpackConfig.entry[entryName].unshift(
          path.join(__dirname, '..', 'dist', 'socketClient.js')
        )
      }
    }

    if (!fs.existsSync(devBuildIndicator) || forceInject) {
      this.cliTools.info(`Rebuilding JS to inject Carotene-Client into frontend.`)
      jobManager.reset()
      jobManager.setCallbackOnFinish(function () {
        jobManager.setCallbackOnFinish(function () {
        })
        if (this.core.getErrors().length < 1) {
          fs.writeFileSync(devBuildIndicator, '\r')
          this.startWatch()
        } else {
          this.cliTools.warn(`Cant inject Carotene-Client into frontend. There were Errors. Please fix them first`)
        }
      }.bind(this))

      this.core.getDispatcher().dispatchCommand(jsBuildCommand)

    } else {
      this.cliTools.info(`Carotene-Client is already injected.`)

      this.startWatch()
    }
  }

  startWatch() {
    this.initSocket()
    this.cliTools.info(`Opening Socket...`)
    this.addAllWatcher()
    this.cliTools.info(`Waiting for a filechange...`)
  }

  initSocket() {
    const Socket = require('./socket.js')
    this.socket = new Socket(this.core)
    this.socket.init()
  }

  addAllWatcher() {
    for (const watcherConfig of this.watcherConfigs) {
      this.addWatcher(watcherConfig)
    }
  }

  addWatcher(watcherConfig) {
    this.watcher.push(new FileWatcher(this.socket, this.core, watcherConfig, this, this.beforeRunByChange, this.afterRunByChange))
  }

}

module.exports = DevServer

