const chokidar = require('chokidar')
const path = require('path')
const fs = require('fs')

/**
 * This class is a wrapper for a watcher instance
 */
class FileWatcher {
  /**
   * @param socket        - The socket instance
   * @param core          - Flamingo-carotene core
   * @param watcherConfig - Config object for the file watcher
   *    watchId     - a unique watchId
   *    watchPaths  - Array of paths with globbing to be watched
   *    command     - flamingo carotene command, that will be triggered
   *    callbackKey - key of config[KEY].callback function, that will be called
   *    watcherConfig - (optional) config object to be passed to the chokidar file watcher
   *    unwatchConfig - (optional) string or array of strings of file-, folder-, or glob-paths
   */
  constructor (socket, core, watcherConfig) {
    // Socket to client
    this.socket = socket

    // carotene dispatcher
    this.dispatcher = core.getDispatcher()

    // carotene cliTools
    this.cliTools = core.getCliTools()

    // carotene config
    this.config = core.getConfig()

    watcherConfig = watcherConfig || {}
    this.watchId = watcherConfig.watchId
    this.watchPaths = watcherConfig.path
    this.command = watcherConfig.command
    this.callbackKey = watcherConfig.callbackKey
    this.watcherConfig = Object.assign(
      this.config.devServer.watcherConfig || {},
      watcherConfig.watcherConfig || {}
    )
    this.unwatchConfig = watcherConfig.unwatchConfig

    // instance of chokidar
    this.watcher = null

    // flag, if this watcher is currently running a build
    this.buildInProgress = false

    // flag, if the watcher needs to rerun after the build is finished
    this.rerunAfterBuild = false

    // buffer, where a original callback is stored, as long as it is overwritten
    this.originalBuildCallback = null

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
    const basePath = this.config.paths.src
    if (path.substr(0, basePath.length) === basePath) {
      path = path.substr(basePath.length)
    }
    return path
  }

  /**
   * Setup watcher
   */
  initialize () {
    // chokidar dont like windows \ in paths
    // replacing them with / works
    if (process.platform === 'win32') {
      const windowsPaths = [];
      for (let watchPath of this.watchPaths) {
        windowsPaths.push(watchPath.split('\\').join('/'));
      }
      this.watchPaths = windowsPaths;
    }

    // setup watcher
    this.watcher = chokidar.watch(this.watchPaths, this.watcherConfig)

    if (this.unwatchConfig) {
      this.watcher.unwatch(this.unwatchConfig)
    }

    // start watcher
    this.watcher.on('change', this.buildOnChange.bind(this))
    this.watcher.on('error', error => this.cliTools.warn(error))

    // filter basePath in display
    const showWatchPaths = []
    for (let watchPath of this.watchPaths) {
      showWatchPaths.push(this.removeBasePathFromPath(watchPath))
    }

    // output state in CLI
    this.cliTools.info(`Watcher-${this.watchId}: listens to ${showWatchPaths.join(', ')} `, true)
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
    // save original callback...
    this.originalBuildCallback = this.config[this.callbackKey].buildCallback

    // overwrite callback...
    this.config[this.callbackKey].buildCallback = this.watcherFinishBuildCallback.bind(this)

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

    // restore old, original callback...
    this.config[this.callbackKey].buildCallback = this.originalBuildCallback

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
