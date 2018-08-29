const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const buildHandler = require('./lib/handler/build')

// class CaroteneWebpack extends CaroteneModule {
class CaroteneWebpack {
  constructor (core) {
    // super(core)

    this.listeners = [
      {
        command: 'config',
        priority: -50,
        handler: function (core) {
          const config = core.getConfig()

          config.paths['webpack'] = {}
          config.paths.webpack['src'] = config.paths.src
          config.paths.webpack['dist'] = config.paths.dist

          config['webpack'] = {}
          config.webpack['dist'] = {}
          config.webpack.dist['jsFolderName'] = 'js'
          config.webpack.dist['cssFolderName'] = 'css'
          config.webpack.dist['fontFolderName'] = 'font'
          config.webpack.dist['imageFolderName'] = 'image'

          config.webpack['rulesInclude'] = null
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
      }
    ]
  }

  getListeners() {
    return this.listeners
  }
}

module.exports = CaroteneWebpack
