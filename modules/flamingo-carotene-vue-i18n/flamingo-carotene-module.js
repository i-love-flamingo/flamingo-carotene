const path = require('path')
const { buildI18n } = require('./lib/handler/build')


class FlamingoCaroteneVueJs {
  constructor (core) {
    const config = core.getConfig()
    // Create default paths for internationalization
    config.paths.vueI18n = path.join(config.paths.project, '..', 'translations', 'merged')
    config.paths.generated = path.join(config.paths.project, 'generated', 'i18n')

    this.listeners = [
      {
        command: 'build',
        // Create internationalized translations
        handler: function (core) {
          buildI18n(core)
        }
      },
      {
        command: 'translate',
        description: 'Builds internationalized file for VueJs',
        handler: function (core) {
          buildI18n(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneVueJs
