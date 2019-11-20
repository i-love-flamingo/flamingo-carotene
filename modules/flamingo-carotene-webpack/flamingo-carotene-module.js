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
            buildCallback: null,
            watcher: {
              sass: {
                unwatchConfig: []
              }
            }
          }

          config.paths.webpackCache = path.join(config.paths.project, '.cache')
        }
      },
      {
        command: 'config',
        handler: function (core) {
          sassWatcher.unwatchConfig = config.webpack.watcher.sass.unwatchConfig
          watcher.push(sassWatcher)
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
        description: 'Build CSS and JS with Webpack',
        handler: buildHandlerAll
      },
      {
        command: 'buildWebpack',
        description: 'Build CSS and JS with Webpack',
        handler: buildHandlerAll
      },
      {
        command: 'buildWebpackJs',
        description: 'Build JS with Webpack',
        handler: buildHandlerJs
      },
      {
        command: 'buildWebpackCss',
        description: 'Build CSS with Webpack',
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

    const sassWatcher =  {
      watchId: 'webpackSass',
      path: [
        path.join(config.paths.src, '**', '*.{sass,scss}')
      ],
      command: 'watchWebpackCss',
      callbackKey: 'webpackCss',
      unwatchConfig: null // if you need to unwatch specific files
    }

    const watcher = this.watcher = [
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

  getDictionaryOptions() {
    return [{
      option: 'forceDev',
      description: 'Force webpack to use "development" as buildMode'
    }]
  }
}

module.exports = FlamingoCaroteneWebpack
