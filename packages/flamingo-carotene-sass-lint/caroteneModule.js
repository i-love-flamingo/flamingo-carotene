const buildHandler = require('./lib/handler/build')

// class CarotenePug extends CaroteneModule {
class SassLint {
  constructor (core) {
    // super(core)
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          config.paths.sassLint = __dirname
          if (!config.sassLint) {
            config.sassLint = {}
          }
          config.sassLint.breakOnError = false
        }
      },
      {
        command: 'lint',
        handler: buildHandler
      },
      {
        command: 'watchWebpackCss',
        handler: buildHandler
      },
      {
        command: 'buildTemplates',
        handler: buildHandler
      },
      {
        command: 'build',
        handler: function (core) {
          const config = core.getConfig()
          config.sassLint.breakOnError = true
          buildHandler(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = SassLint
