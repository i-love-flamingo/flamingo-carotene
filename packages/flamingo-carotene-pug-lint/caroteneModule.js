const lintHandler = require('./lib/handler/lint')

// class CarotenePug extends CaroteneModule {
class PugLint {
  constructor (core) {
    // super(core)
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          config.paths.pugLint = __dirname
          if (!config.pugLint) {
            config.pugLint = {}
          }
          config.pugLint.breakOnError = false
        }
      },
      {
        command: 'lint',
        handler: lintHandler
      },
      {
        command: 'build',
        handler: function (core) {
          const config = core.getConfig()
          config.pugLint.breakOnError = true
          lintHandler(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = PugLint
