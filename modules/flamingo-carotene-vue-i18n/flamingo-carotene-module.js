const path = require('path')
const { buildI18nHandler } = require('/lib/handler/build')


class FlamingoCaroteneVueJs {
  constructor (core) {
    const config = core.getConfig()
    // Create default paths for internationalization
    config.paths.vueI18n = path.join(config.paths.project, '..', 'translations', 'merged')
    config.paths.generated = path.join(config.paths.project, 'generated', 'i18n')

    this.listeners = [
      {
        command: 'config',
        handler: function (core) {
          // Create internationalized translations
          buildI18nHandler(core)
        }
      },
      {
        command: 'translate',
        description: 'Builds internationalized file for VueJs',
        handler: function (core) {
          buildI18nHandler(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneVueJs
