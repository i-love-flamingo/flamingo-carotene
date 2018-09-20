const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const buildHandler = require('./lib/handler/build')

// class CarotenePug extends CaroteneModule {
class CarotenePug {
  constructor (core) {
    // super(core)
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          config.paths.pug = {
            src: path.join(config.paths.src, 'pug'),
            dist: path.join(config.paths.dist, 'pug')
          }

          config.pug = {
            filesPattern: '/**/*.pug',
            callback: null
          }
        }
      },
      {
        command: 'buildTemplates',
        handler: buildHandler
      },
      {
        command: 'build',
        handler: buildHandler
      },
      {
        command: 'watchPug',
        handler: buildHandler
      }
    ]

    this.watcher = [
      {
        'watchId': 'pug',
        'path': [
          path.join(config.paths.src, '**', '*.pug')
        ],
        'command': 'watchPug',
        'callbackKey': 'pug'
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

module.exports = CarotenePug
