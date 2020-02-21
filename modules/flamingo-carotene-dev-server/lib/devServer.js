const FileWatcher = require('./fileWatcher')
const AnsiConverter = require('ansi-to-html');

class DevServer {

  constructor (socket, core) {
    this.socket = socket
    this.core = core
    this.cliTools = core.getCliTools()
    this.watcher = []
    this.lastBuildTime = 0
    this.watcherVerbose = this.cliTools.hasOption('--verboseWatch')
  }

  addWatcher(watcherConfig) {
    this.watcher.push(new FileWatcher(this.socket, this.core, watcherConfig, this, this.beforeRunByChange, this.afterRunByChange))
  }

  start() {
    this.cliTools.info(`Waiting for a filechange...`)
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
        return `${message}\n`;
      })
      const ansiConverter = new AnsiConverter({
        newline: true,
        escapeXML: true
      });
      this.socket.reportBuildOutput(ansiConverter.toHtml(output))
    }
  }
}

module.exports = DevServer
