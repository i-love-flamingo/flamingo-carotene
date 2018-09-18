const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')

class FlamingoWatcher {

  /**
   *
   * @param core - flamingo carotene core
   * @param watchId - a unique watchId
   * @param watchPaths - Array of paths with globbing to be watched
   * @param command - flamingo carotene command, that will be triggered
   * @param callbackKey - key of config[KEY].callback function, that will be called
   */
  constructor (watcherCaroteneModule, core, watchId, watchPaths, command, callbackKey)
  {
    this.watcherCaroteneModule = watcherCaroteneModule
    this.watchId = watchId
    this.watchPaths = watchPaths
    this.callbackKey = callbackKey
    this.command = command
    this.watcher = null;
    this.buildInProgress = false
    this.rerunAfterBuild = false
    this.core = core
    this.oldCallback = null
    this.dispatcher = core.getDispatcher()
    this.cliTools = core.getCliTools()
    this.currentChangedPath = ''
    this.initialize()
  }

  /**
   * Returns information if the watcher has an active build process
   * @returns {boolean}
   */
  isBuildInProgress () {
    return this.buildInProgress
  }

  /**
   * Setup watcher
   */
  initialize () {
    // setup watcher
    const isWindows = (process.platform === "win32");
    this.watcher = chokidar.watch(this.watchPaths, {
      ignored: /(^|[\/\\])\../, // dot files or folders
      usePolling: isWindows,
    })

    // start watcher
    this.watcher.on('change', this.buildOnChange.bind(this))
    this.watcher.on('error', error => this.cliTools.warn(error))

    // filter basePath in display
    const config = this.core.getConfig()
    const showWatchPaths = []
    const basePath = config.paths.src
    for (let watchPath of this.watchPaths) {
      if (watchPath.substr(0, basePath.length) === basePath) {
        watchPath = watchPath.substr(basePath.length)
      }
      showWatchPaths.push(watchPath)
    }

    // append SocketIO to webpackJs
    if (this.watchId === 'webpackJs') {
      // check if current dist build IS already a dev build...
      // - If not trigger build
      if (!fs.existsSync(this.getDevBuildFileName())) {
        this.cliTools.info(`Rebuilding JS to inject socketIoClient`)
        this.dispatcher.dispatchCommand(this.command)
        fs.writeFileSync(this.getDevBuildFileName(), '1')
      }

      this.appendSocketId()
    }

    // output state in CLI
    this.cliTools.info(`Watcher-${this.watchId}: listens to ${showWatchPaths.join(', ')} `)
  }

  /**
   * Get the FQ-Path for the devBuild "lock"-file
   * @returns {*}
   */
  getDevBuildFileName () {
    const config = this.core.getConfig()
    return path.join(config.paths.dist, 'isDevBuild')
  }

  /** Appends SocketIO lib to build JS */
  appendSocketId () {
    const config = this.core.getConfig()
    const entryNames = Object.keys(config.webpackConfig.entry)
    for (const entryName of entryNames) {
      // Add the socket client to the beginning of every multi file entry
      if (Array.isArray(config.webpackConfig.entry[entryName])) {
        config.webpackConfig.entry[entryName].unshift(
          path.join(__dirname, 'socketIoClient.js')
        )
      }
    }
  }

  /**
   * if something has changed - start building...
   * @param changedPath
   */
  buildOnChange (changedPath) {
    this.currentChangedPath = changedPath;
    this.cliTools.info(`Watcher-${this.watchId}: Change detected...`)

    // if there is a build in progress - que the change and do nothing.
    if (this.isBuildInProgress()) {
      this.cliTools.info(`Watcher-${this.watchId}: Change detected, but build is in Progress, will rebuild after finish`)
      this.rerunAfterBuild = true
    }
    // no build in progress? so - build it!
    else {
      const config = this.core.getConfig()

      // save original callback...
      this.oldCallback = config[this.callbackKey].callback

      // overwrite callback...
      config[this.callbackKey].callback = this.watcherFinishBuildCallback.bind(this)

      // start building
      this.rerunAfterBuild = false
      this.buildInProgress = true
      this.dispatcher.dispatchCommand(this.command)
    }
  }

  /**
   * watcher build is finish.
   */
  watcherFinishBuildCallback () {
    this.cliTools.info(`Watcher-${this.watchId}: Build finished`)

    const config = this.core.getConfig()

    // restore old, original callback...
    config[this.callbackKey].callback = this.oldCallback;

    this.buildInProgress = false

    // reload browser
    this.watcherCaroteneModule.reportBuildStateToClient()


    // if there was a change while building - rebuild this thing
    if (this.rerunAfterBuild) {
      this.rerunAfterBuild = false
      this.cliTools.info(`Watcher-${this.watchId}: Rebuilding, cause of change while building...`)
      this.buildOnChange(this.currentChangedPath)
    }
  }

}

module.exports = FlamingoWatcher