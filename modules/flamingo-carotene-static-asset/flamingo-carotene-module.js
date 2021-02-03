const buildHandler = require('./lib/handler/build')
const path = require('path')

class FlamingoCaroteneStaticAsset {
  constructor (core) {
    this.config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: core => {
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
        handler: core => buildHandler(core)
      },
      {
        command: 'copyAssets',
        description: 'Copy static assets',
        handler: core => buildHandler(core)
      },
      {
        command: 'watchCopyAssets',
        handler: core => buildHandler(core)
      },
    ]
  }

  getListeners () {
    return this.listeners
  }

  getWatchers () {
    const pathsToWatch = []
    this.config.staticAsset.assetPaths
      .forEach(assetPath => pathsToWatch.push(path.join(this.config.paths.src, assetPath.src, '**', '*')))

    return [{
      watchId: 'staticAsset',
      path: pathsToWatch,
      command: 'watchCopyAssets',
      socketCommand: 'built',
      callbackKey: 'staticAsset',
      unwatchConfig: null // if you need to unwatch specific files
    }]
  }
}

module.exports = FlamingoCaroteneStaticAsset
