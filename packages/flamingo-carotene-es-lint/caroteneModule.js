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
          config.paths.esLint = __dirname
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

module.exports = ESLint
