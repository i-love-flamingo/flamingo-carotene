const path = require('path')

const buildHandler = require('./lib/handler/build')
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

          config['webpackConfig'] = new WebpackConfig(core)
        }
      },
      {
        command: 'build',
        handler: buildHandler
      },
      {
        command: 'buildWebpack',
        handler: buildHandler
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
        callbackKey: 'webpack',
        unwatchConfig: path.join(config.paths.src, '**', 'fontIcon.sass')
      },
      {
        watchId: 'webpackJs',
        path: [
          path.join(config.paths.src, '**', '*.js')
        ],
        command: 'watchWebpackJs',
        callbackKey: 'webpack'
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
