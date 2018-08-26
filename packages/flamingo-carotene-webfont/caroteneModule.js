// import WebfontPlugin from 'webfont-webpack-plugin'
const WebfontPlugin = require('webfont-webpack-plugin').default
const path = require('path')

class CaroteneWebfont {
  constructor (config, cliTools) {
    this.listeners = [
      {
        command: 'config',
        priority: 50,
        handler: function (config, cliTools) {
          // Webfont config - post config creation
          if (!config.webfont || typeof config.webfont.options !== 'object') {
            cliTools.warn('No webfont config found! Provide a config.webfont.options object to use the webfont webpack plugin.')
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

module.exports = CaroteneWebfont
