const lintHandler = require('./lib/handler/lint')

class SassLint {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

          config.paths.sassLint = __dirname

          config.sassLint = {
            breakOnError: false
          }
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
          config.sassLint.breakOnError = true
          lintHandler(core)
        }
      },
      {
        command: 'watchWebpackCss',
        handler: lintHandler
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = SassLint
