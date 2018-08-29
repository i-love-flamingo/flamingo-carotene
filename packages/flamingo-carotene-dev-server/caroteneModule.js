const path = require('path')

const chokidar = require('chokidar')
const io = require('socket.io')()
const debounce = require('debounce')

class CaroteneDevServer {
  constructor (core) {
    this.core = core
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
    this.dispatcher = null // Get dispatcher after module initialization!! Currently the dispatcher initializes all modules and would step into infinite loop

    this.typesToBuild = {
      pug: false,
      js: false,
      sass: false
    }

    this.pendingRebuild = false
    this.rebuildQueue = []

    this.listeners = [
      {
        command: 'config',
        priority: -10,
        handler: function (core) {
          const command = core.getCliTools().getCommand()

          // Set environment to development
          if (command === 'dev') {
            process.env.NODE_ENV = 'development'
          }
        }
      },
      {
        command: 'config',
        handler: (core) => {
          // Webpack config
          const command = core.getCliTools().getCommand()

          if (command === 'dev') {
            const config = core.getConfig()

            config.webpack.callback = (core) => {
              // ToDO: Check if build is really done - probably pug is still building
              io.emit('built')
              this.pendingRebuild = false
            }

            config.pug.callback = (core) => {
              // ToDO: Check if build is really done - probably webpack is still building
              io.emit('built')
              this.pendingRebuild = false
            }
          }
        }
      },
      {
        command: 'dev',
        handler: (core) => {
          const watchFiles = [
            path.join(this.config.paths.src, '**', '*.pug'),
            path.join(this.config.paths.src, '**', '*.js'),
            path.join(this.config.paths.src, '**', '*.sass'),
          ]

          const watcher = chokidar.watch(watchFiles, {
            ignored: /(^|[\/\\])\../, // dot files or folders
          })

          watcher.unwatch(path.join(this.config.paths.src, '**', 'fontIcon.sass'))

          watcher.on('ready', () => {
            console.log('File watcher ready')

            // ToDo: Detect if we already have a ready to go dev build
            this.rebuild(true)

            const entryNames = Object.keys(this.config.webpackConfig.entry)

            for (const entryName of entryNames) {
              // Add the socket client to the beginning of every multi file entry
              if (Array.isArray(this.config.webpackConfig.entry[entryName])) {
                this.config.webpackConfig.entry[entryName].unshift(
                  path.join(__dirname, 'lib', 'socketIoClient.js')
                )
              }
            }

            io.on('connection', (client) => {
              console.info(`Connected to client: ${client.id}`)
            })

            io.listen(3000)
          })

          watcher.on('change', (pathName) => {
            console.log('change on: ' + pathName)

            const type = path.extname(pathName).slice(1)

            this.typesToBuild[type] = true

            this.rebuild()
          })

          watcher.on('error', error => this.cliTools.warn(error))
        }
      }
    ]
  }

  getDispatcher () {
    if (this.dispatcher !== null) {
      return this.dispatcher
    }

    this.dispatcher = this.core.getDispatcher()

    return  this.dispatcher
  }

  rebuild (fullBuild) {
    console.log('called rebuild')

    debounce(this.debouncedRebuild, 400).call(this, fullBuild)
  }

  debouncedRebuild (fullBuild) {
    if (this.pendingRebuild === true) {
      // ToDo: Queue the additional requested rebuild and trigger after build is done
      console.log('Rebuild prevented - already building')
      return
    }

    this.pendingRebuild = true

    if (fullBuild) {
      this.getDispatcher().dispatchCommand('build')
      return
    }

    console.log('Rebuild types:')
    console.log(this.typesToBuild)

    // Trigger full build when all file types has changed
    if (this.typesToBuild.pug && this.typesToBuild.js && this.typesToBuild.sass) {
      this.getDispatcher().dispatchCommand('build')

      this.typesToBuild.pug = false
      this.typesToBuild.js = false
      this.typesToBuild.sass = false

      return
    }

    // Trigger pug build
    if (this.typesToBuild.pug) {
      this.getDispatcher().dispatchCommand('buildTemplates')

      this.typesToBuild.pug = false
    }

    // Trigger webpack build when sass and js has changed
    if (this.typesToBuild.js && this.typesToBuild.sass) {
      this.getDispatcher().dispatchCommand('buildWebpack')

      this.typesToBuild.js = false
      this.typesToBuild.sass = false
    }

    // Trigger webpack js build
    if (this.typesToBuild.js) {
      this.getDispatcher().dispatchCommand('buildWebpackJs')

      this.typesToBuild.js = false
    }

    // Trigger webpack css build
    if (this.typesToBuild.sass) {
      this.getDispatcher().dispatchCommand('buildWebpackCss')

      this.typesToBuild.sass = false
    }
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = CaroteneDevServer