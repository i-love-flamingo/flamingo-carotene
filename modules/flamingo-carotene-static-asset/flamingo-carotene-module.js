const buildHandler = require('./lib/handler/build')

class FlamingoCaroteneStaticAsset {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()
          config.staticAsset = {
            assetPaths: [
              {
                dest: 'asset',
                src: 'asset'
              }
            ],
            basePaths: {
              dest: config.paths.dist,
              src: config.paths.src
            }
          }
        }
      },
      {
        command: 'build',
        description: 'Copy static assets',
        handler: function (core) {
          buildHandler(core)
        }
      },
      {
        command: 'copyAssets',
        description: 'Copy static assets',
        handler: function (core) {
          buildHandler(core)
        }
      },
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneStaticAsset
