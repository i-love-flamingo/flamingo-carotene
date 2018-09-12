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
        }
      },
      {
        command: 'buildTemplates',
        handler: buildHandler
      },
      {
        command: 'build',
        handler: buildHandler
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = SassLint
