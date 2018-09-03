const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const buildHandler = require('./lib/handler/build')

// class CarotenePug extends CaroteneModule {
class CarotenePug {
  constructor (core) {
    // super(core)

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

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
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = CarotenePug
