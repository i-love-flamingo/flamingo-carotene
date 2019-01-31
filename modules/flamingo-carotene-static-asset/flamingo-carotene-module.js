const path = require('path')
const buildHandler = require('./lib/handler/build')

class FlamingoCaroteneStaticAsset {
  constructor (core) {
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 110,
        handler: function (core) {
          config.staticAsset = {
            link: [],
            paths: {
              dist: config.paths.dist,
              src: config.paths.src
            }
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
          buildHandler(core)
        }
      },
      {
        command: 'watchAsset',
        handler: buildHandler
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

module.exports = FlamingoCaroteneStaticAsset
