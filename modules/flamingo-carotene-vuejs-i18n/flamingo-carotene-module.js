const {buildHandler, entriesHandler} = require('./lib/handler/build')

class FlamingoCaroteneVueJsI18n {
  constructor (core) {
    this.config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        handler: function (core) {
          const config = core.getConfig()

          const vueTranslationEntries = entriesHandler()

          config.webpackConfig.entry = {
            ...config.webpackConfig.entry,
            ...vueTranslationEntries,
          }
        }
      },
      {
        command: 'build',
        description: 'Builds internationalized file for VueJs',
        handler: function (core) {
          buildHandler(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneVueJsI18n
