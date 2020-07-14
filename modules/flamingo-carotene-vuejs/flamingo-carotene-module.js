const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

class FlamingoCaroteneVueJs {
  constructor (core) {
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: -50,
        handler: function (core) {
          const cliTools = core.getCliTools()

          if (!config.webpackConfig || !config.webpackConfig.resolve || !config.webpackConfig.resolve.extensions) {
            cliTools.warn('VueJS is configured to use a webpack loader but there is no webpack config available')
            return
          }
          // Add vue to the list of extensions WebPack should resolve file names to
          config.webpackConfig.resolve.extensions.push('.vue')

          if (!config.webpackConfig || !config.webpackConfig.module || !config.webpackConfig.module.rules) {
            cliTools.warn('VueJs is configured to use a webpack loader but there is no webpack config available')
            return
          }

          // Add new loaders for Vue and Pug/Vue compatibility
          config.webpackConfig.module.rules = [
            ...config.webpackConfig.module.rules,
            {
              test: /\.pug$/,
              use: [
                {
                  loader: 'pug-plain-loader',
                  options: {
                    basedir: path.join(config.paths.webpack.src, '../'),
                  },
                },
              ],
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
          ]

          // Add Vue Loader Plugin
          config.webpackConfig.plugins.push(new VueLoaderPlugin())
        }
      }
    ]

    this.watcher = [
      {
        watchId: 'vue',
        path: [
          path.join(config.paths.src, '**', '*.vue'),
        ],
        command: 'watchWebpackJs',
        socketCommand: 'reloadJS',
        callbackKey: 'webpackJs',
      },
    ]
  }

  getListeners () {
    return this.listeners
  }

  getWatchers () {
    return this.watcher
  }
}

module.exports = FlamingoCaroteneVueJs
