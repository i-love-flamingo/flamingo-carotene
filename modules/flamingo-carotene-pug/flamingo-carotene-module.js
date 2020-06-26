const path = require('path')
const buildHandler = require('./lib/handler/build')

class FlamingoCarotenePug {
  constructor (core) {
    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          config.paths.pug = {
            src: path.join(config.paths.src, 'page'),
            dist: path.join(config.paths.dist, 'template')
          }

          config.pug = {
            filesPattern: '/{*,.,*/page/*}/{.,*,*/*.partial}/*.pug',
            buildCallback: null,
            fileMode: 'ast',
            useRelativeSrc: false,
            breakOnError: false
          }
        }
      },
      {
        command: 'buildTemplates',
        description: 'Build all PUG Templates',
        handler: buildHandler
      },
      {
        command: 'build',
        description: 'Build all PUG Templates',
        handler: function (core) {
          const config = core.getConfig()
          config.pug.breakOnError = true
          buildHandler(core)
        }
      },
      {
        command: 'watchPug',
        handler: buildHandler
      },
      {
        command: 'pug-async-compile',
        handler: buildHandler
      }
    ]

    this.watcher = [
      {
        watchId: 'pug',
        path: [
          path.join(config.paths.src, '**', '*.pug')
        ],
        command: 'watchPug',
        callbackKey: 'pug'
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

module.exports = FlamingoCarotenePug
