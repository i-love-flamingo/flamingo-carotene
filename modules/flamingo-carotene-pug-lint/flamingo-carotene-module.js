const lintHandler = require('./lib/handler/lint')

class PugLint {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          config.paths.pugLint = __dirname

          config.pugLint = {
            filesPattern: '/**/*.pug',
            breakOnError: false
          }
        }
      },
      {
        command: 'lint',
        handler: lintHandler
      },
      {
        command: 'lintPug',
        handler: lintHandler
      },
      {
        command: 'build',
        handler: function (core) {
          const config = core.getConfig()
          config.pugLint.breakOnError = true
          lintHandler(core)
        }
      },
      {
        command: 'watchPug',
        handler: lintHandler
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = PugLint
