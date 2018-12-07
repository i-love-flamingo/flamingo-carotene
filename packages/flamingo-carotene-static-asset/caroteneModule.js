const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const buildHandler = require('./lib/handler/build')

// class CaroteneStaticAssets extends CaroteneModule {
class CaroteneStaticAsset {
  constructor (core) {
    // super(core)
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 110,
        handler: function (core) {

          config.staticAsset = {
            staticAssetPattern: '/*',
          }
        }
      },
      {
        command: 'buildTemplates',
        handler: buildHandler
      },
      {
        command: 'build',
        handler: function (core) {
          const config = core.getConfig()
          buildHandler(core)
        }
      },
      {
        command: 'watchAsset',
        handler: buildHandler
      }
    ]

    this.watcher = [
      {
        'watchId': 'static-asset',
        'path': [
          path.join(config.paths.src, 'asset', '**', '*.*')
        ],
        'command': 'watchAsset',
        'callbackKey': 'static-asset'
      }
    ]
  }

  getListeners () {
    return this.listeners
  }

  getWatcherForDevServer () {
    return this.watcher
  }
}

module.exports = CaroteneStaticAsset
