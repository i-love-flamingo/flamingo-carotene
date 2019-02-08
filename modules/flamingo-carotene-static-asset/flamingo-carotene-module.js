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
            assetPaths: [],
            basePaths: {
              dest: config.paths.dist,
              src: config.paths.src
            }
          }
        }
      },
      {
        command: 'build',
        handler: function (core) {
          buildHandler(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneStaticAsset
