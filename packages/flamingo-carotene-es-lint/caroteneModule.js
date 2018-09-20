const buildHandler = require('./lib/handler/build')

// class CarotenePug extends CaroteneModule {
class ESLint {
  constructor (core) {

    // super(core)
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

          if (!config.eslint) {
            config.eslint = {}
          }
          config.eslint.breakOnError = false
          config.paths.esLint = __dirname
        }
      },
      {
        command: 'lint',
        handler: buildHandler
      },
      {
        command: 'buildTemplates',
        handler: buildHandler
      },
      {
        command: 'build',
        handler: function(core) {
          const config = core.getConfig()
          config.eslint.breakOnError = true
          buildHandler(core)
        }
      },
      {
        command: 'watchWebpackJs',
        handler: buildHandler
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = ESLint
