const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const WebpackConfig = require('./src/class/webpackConfig')
const buildHandler = require('./handler/build')

// class CaroteneWebpack extends CaroteneModule {
class CaroteneWebpack {
  constructor (config, cliTools) {
    // super(config, cliTools)

    this.listeners = [
      {
        command: 'config',
        priority: -50,
        handler: function (config, cliTools) {
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
        handler: function (config, cliTools) {
          config['webpackConfig'] = new WebpackConfig(config, cliTools)
        }
      },
      {
        command: 'build',
        handler: buildHandler
      }
    ]
  }

  getListeners() {
    return this.listeners
  }
}

module.exports = CaroteneWebpack
