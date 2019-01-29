class FlamingoCaroteneWebfont {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: -100,
        handler: function (core) {
          const WebfontPlugin = require('webfont-webpack-plugin').default
          const config = core.getConfig()

          // Webfont config - post config creation
          if (!config.webfont || typeof config.webfont.options !== 'object') {
            core.getCliTools().warn('No webfont config found! Provide a config.webfont.options object to use the webfont webpack plugin.')
            return
          }

          config.webpackConfig.plugins = config.webpackConfig.plugins || []
          config.webpackConfig.plugins = [
            ...config.webpackConfig.plugins,
            new WebfontPlugin(config.webfont.options)
          ]
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneWebfont
