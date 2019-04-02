const path = require('path')

// const CaroteneModule = require('../flamingo-carotene-module')
const buildHandler = require('./handler/build')

// class CarotenePug extends CaroteneModule {
class CarotenePug {
  constructor (config, cliTools) {
    // super(config, cliTools)

    this.listeners = [
      {
        command: 'config',
        priority: -50,
        handler: function (config, cliTools) {
          config.paths.pug = {
            src: path.join(config.paths.src, 'pug'),
            dist: path.join(config.paths.dist, 'pug')
          }
          config.pug = {
            filesPattern: '/**/*.pug'
          }
        }
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
