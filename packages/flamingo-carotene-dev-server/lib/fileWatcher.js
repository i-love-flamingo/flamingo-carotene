const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')

/**
 * This class is a wrapper for a watcher instance
 */
class FileWatcher {
  /**
   * @param socket  - The socket instance
   * @param core    - Flamingo-carotene core
   * @param config  - Config object for the file watcher
   *    watchId     - a unique watchId
   *    watchPaths  - Array of paths with globbing to be watched
   *    command     - flamingo carotene command, that will be triggered
   *    callbackKey - key of config[KEY].callback function, that will be called
   */
  constructor (socket, core, config) {
    // Socket to client
    this.socket = socket

    // flamingo-carotene-core
    this.core = core

    config = config || {}
    this.watchId = config.watchId
    this.watchPaths = config.path
    this.command = config.command
    this.callbackKey = config.callbackKey

    // instance of chokidar
    this.watcher = null

    // flag, if this watcher is currently running a build
    this.buildInProgress = false

    // flag, if the watcher needs to rerun after the build is finished
    this.rerunAfterBuild = false

    // buffer, where a original callback is stored, as long as it is overwritten
    this.originalBuildCallback = null

    // carotene dispatcher
    this.dispatcher = core.getDispatcher()

    // carotene cliTools
    this.cliTools = core.getCliTools()

    // if a build is triggered, the file-path, which has trigger the change
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

  removeBasePathFromPath (path) {
    const config = this.core.getConfig()
    const basePath = config.paths.src
    if (path.substr(0, basePath.length) === basePath) {
      path = path.substr(basePath.length)
    }
    return path
  }

  /**
   * Setup watcher
   */
  initialize () {
    const config = this.core.getConfig()

    // chokidar dont like windows \ in paths
    // replacing them with / works
    if (process.platform === 'win32') {
      var windowsPaths = [];
      for (let watchPath of this.watchPaths) {
        windowsPaths.push(watchPath.split('\\').join('/'));
      }
      this.watchPaths = windowsPaths;
    }

    // setup watcher
    // const usePolling = (process.platform === 'win32' || process.platform === 'linux')
    this.watcher = chokidar.watch(this.watchPaths, {
      ignored: /(^|[/\\])\../, // dot files or folders
      // usePolling: usePolling
    })

    this.watcher.unwatch(path.join(config.paths.src, '**', 'fontIcon.sass'))

    // start watcher
    this.watcher.on('change', this.buildOnChange.bind(this))
    this.watcher.on('error', error => this.cliTools.warn(error))

    // filter basePath in display
    const showWatchPaths = []
    for (let watchPath of this.watchPaths) {
      showWatchPaths.push(this.removeBasePathFromPath(watchPath))
    }

    // append SocketIO to webpackJs
    if (this.watchId === 'webpackJs') {
      // check if current dist build IS already a dev build...
      // - If not trigger build.
      if (!fs.existsSync(this.getDevBuildFileName())) {
        this.cliTools.info(`Rebuilding JS to inject socketClient`, true)
        this.dispatcher.dispatchCommand(this.command)
        fs.writeFileSync(this.getDevBuildFileName(), '1')
      }

      this.appendSocketId()
    }

    // output state in CLI
    this.cliTools.info(`Watcher-${this.watchId}: listens to ${showWatchPaths.join(', ')} `, true)
  }

  /**
   * Get the FQ-Path for the devBuild "lock"-file
   * @returns {*}
   */
  getDevBuildFileName () {
    const config = this.core.getConfig()
    return path.join(config.paths.dist, 'isDevBuild')
  }

  /**
   * Appends SocketIO lib to JS
   * This is needed to autoreload Browser via Websocket on buildchange.
   */
  appendSocketId () {
    const config = this.core.getConfig()
    const entryNames = Object.keys(config.webpackConfig.entry)
    for (const entryName of entryNames) {
      // Add the socket client to the beginning of every multi file entry
      if (Array.isArray(config.webpackConfig.entry[entryName])) {
        config.webpackConfig.entry[entryName].unshift(
          path.join(__dirname, 'socketClient.js')
        )
      }
    }
  }

  /**
   * if something has changed - start building...
   * @param changedPath
   */
  buildOnChange (changedPath) {
    this.currentChangedPath = changedPath
    const displayChangedPath = this.removeBasePathFromPath(changedPath)
    this.cliTools.info(`Watcher-${this.watchId}: Change ${displayChangedPath}`, true)

    // if there is a build in progress - que the change and do nothing.
    if (this.isBuildInProgress()) {
      this.cliTools.info(`Watcher-${this.watchId}: Change detected, but build is in Progress, will rebuild after finish`, true)
      this.rerunAfterBuild = true
      return
    }

    // no build in progress? so - build it!
    const config = this.core.getConfig()

    // save original callback...
    this.originalBuildCallback = config[this.callbackKey].buildCallback

    // overwrite callback...
    config[this.callbackKey].buildCallback = this.watcherFinishBuildCallback.bind(this)

    // start building
    this.rerunAfterBuild = false
    this.buildInProgress = true
    this.dispatcher.dispatchCommand(this.command)
  }

  /**
   * watcher build is finish.
   */
  watcherFinishBuildCallback () {
    this.cliTools.info(`Watcher-${this.watchId}: Build finished`, true)

    const config = this.core.getConfig()

    // restore old, original callback...
    config[this.callbackKey].buildCallback = this.originalBuildCallback

    this.buildInProgress = false

    // reload browser
    this.socket.emit('built')

    // if there was a change while building - rebuild this thing
    if (this.rerunAfterBuild) {
      this.rerunAfterBuild = false
      this.cliTools.info(`Watcher-${this.watchId}: Rebuilding, cause of change while building...`, true)
      this.buildOnChange(this.currentChangedPath)
    }
  }
}

module.exports = FileWatcher
