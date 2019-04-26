const path = require('path')

const buildHandlerAll = require('./lib/handler/buildAll')
const buildHandlerJs = require('./lib/handler/buildJs')
const buildHandlerCss = require('./lib/handler/buildCss')

class FlamingoCaroteneWebpack {
  constructor (core) {
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          config.paths.webpack = {
            src: config.paths.src,
            dist: config.paths.dist
          }

          config.webpack = {
            dist: {
              jsFolderName: 'js',
              cssFolderName: 'css',
              fontFolderName: 'font',
              imageFolderName: 'image'
            },
            rulesInclude: null,
            buildCallback: null
          }

          config.paths.webpackCache = path.join(config.paths.project, '.cache')
        }
      },
      {
        command: 'config',
        handler: function (core) {
          const config = core.getConfig()
          const WebpackConfig = require('./lib/webpackConfig')
          const webpackConfig = new WebpackConfig(core)

          config['webpackConfig'] = webpackConfig.getWebpackConfig()
          config['webpackCacheConfig'] = webpackConfig.getCacheConfig()
        }
      },
      {
        command: 'build',
        handler: buildHandlerAll
      },
      {
        command: 'buildWebpack',
        handler: buildHandlerAll
      },
      {
        command: 'buildWebpackJs',
        handler: buildHandlerJs
      },
      {
        command: 'buildWebpackCss',
        handler: buildHandlerCss
      },
      {
        command: 'watchWebpackJs',
        handler: buildHandlerJs
      },
      {
        command: 'watchWebpackCss',
        handler: buildHandlerCss
      }
    ]

    this.watcher = [
      {
        watchId: 'webpackSass',
        path: [
          path.join(config.paths.src, '**', '*.sass')
        ],
        command: 'watchWebpackCss',
        callbackKey: 'webpackCss',
        unwatchConfig: path.join(config.paths.src, '**', 'fontIcon.sass')
      },
      {
        watchId: 'webpackJs',
        path: [
          path.join(config.paths.src, '**', '*.js')
        ],
        command: 'watchWebpackJs',
        callbackKey: 'webpackJs'
      }
    ]
  }

  getListeners () {
    return this.listeners
  }

  getWatchers () {
    return this.watcher
  }
}

module.exports = FlamingoCaroteneWebpack
