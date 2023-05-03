const path = require('path')

const buildHandlerAll = require('./lib/handler/buildAll')
const buildHandlerJs = require('./lib/handler/buildJs')
const buildHandlerCss = require('./lib/handler/buildCss')
const exportWebpackConfig = require('./lib/handler/exportConfig')

class FlamingoCaroteneWebpack {
  constructor (core) {
    const config = core.getConfig()

    const sassWatcher = {
      watchId: 'webpackSass',
      path: [
        path.join(config.paths.src, '**', '*.{sass,scss}')
      ],
      command: 'watchWebpackCss',
      socketCommand: 'reloadCSS',
      callbackKey: 'webpackCss',
      unwatchConfig: null // if you need to unwatch specific files
    }

    const jsWatcher = {
      watchId: 'webpackJs',
      path: [
        path.join(config.paths.src, '**', '*.js')
      ],
      command: 'watchWebpackJs',
      socketCommand: 'reloadJS',
      callbackKey: 'webpackJs'
    }

    this.watcher = [
      sassWatcher,
      jsWatcher
    ]

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

          config.webpackConfig.resolve = Object.assign({ modules: [] }, config.webpackConfig.resolve)
          config.webpackConfig.resolve.modules.unshift(path.join(path.resolve(__dirname, 'node_modules')))
          config.webpackConfig.resolveLoader = Object.assign({ modules: [] }, config.webpackConfig.resolveLoader)
          config.webpackConfig.resolveLoader.modules.unshift(path.join(path.resolve(__dirname, 'node_modules')))
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
      },
      {
        command: 'exportWebpackConfig',
        description: 'Export generated Webpack config as json file',
        handler: exportWebpackConfig
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
      option: '--forceDev',
      description: 'Force webpack to use "development" as buildMode'
    }, {
      option: '--analyzeBundle',
      description: 'Executes Webpack Bundle Analyzer and creates a visual treemap of all package contents.'
    }, {
      option: '--writeWebpackStats',
      description: 'Write webpack statistics data to stats.json'
    }]
  }
}

module.exports = FlamingoCaroteneWebpack
