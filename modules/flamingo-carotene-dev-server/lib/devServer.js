const FileWatcher = require('./fileWatcher')
const AnsiConverter = require('ansi-to-html')
const path = require('path')
const fs = require('fs')

/**
 * DevServer - Core of all Filewatchers
 */
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

  /**
   * Called, before the jobs of an active watcher starts.
   */
  beforeRunByChange() {
    this.cliTools.info(`DevServer beforeRunByChange`, !this.watcherVerbose)
    this.lastBuildTime = new Date()
    this.core.clearErrors()
    this.core.clearBuildNotes()
  }

  /**
   * Called, when jobs of an active watcher ends
   */
  afterRunByChange() {
    this.cliTools.info(`DevServer afterRunByChange`, !this.watcherVerbose)

    // if there anyone has reported errors or buildNotes to the format that output to html - and send it to client
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

  /**
   * inject client code into js - if nessessary - and start watcher afterwards
   * @param forceInject
   */
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
      this.startWatch()
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
      jobManager.setCallbackOnFinish(_ => {
        // start socket after after injection only once
        jobManager.setCallbackOnFinish(_ => {})
        if (this.core.hasErrors()) {
          this.cliTools.error(`Cant inject Carotene-Client into frontend. There were Errors. Please fix them first!`)
          return
        }

        fs.writeFileSync(devBuildIndicator, '\r')
        this.startWatch()
      })

      this.core.getDispatcher().dispatchCommand(jsBuildCommand)

    } else {
      this.cliTools.info(`Carotene-Client is already injected.`)

      this.startWatch()
    }
  }

  /**
   * Starts all watcher
   */
  startWatch() {
    this.initSocket()
    this.cliTools.info(`Opening Socket...`)
    this.addAllWatcher()
    this.cliTools.info(`Waiting for a filechange...`)
  }

  /**
   * Initialize socket server
   */
  initSocket() {
    const Socket = require('./socket.js')
    this.socket = new Socket(this.core)
    this.socket.init()
  }

  /**
   * adds all watcher
   */
  addAllWatcher() {
    for (const watcherConfig of this.watcherConfigs) {
      this.addWatcher(watcherConfig)
    }
  }

  /**
   * adds a single watcher
   * @param watcherConfig
   */
  addWatcher(watcherConfig) {
    this.watcher.push(new FileWatcher(this.socket, this.core, watcherConfig, this, this.beforeRunByChange, this.afterRunByChange))
  }

}

module.exports = DevServer

