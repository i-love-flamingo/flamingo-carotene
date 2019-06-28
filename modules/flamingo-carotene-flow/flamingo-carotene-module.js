const path = require('path')
const flowHandler = require('./lib/handler/flow')

const configFileNames = ['.flowconfig']

const defaultConfigFileName = '.flowconfig'

class Flow {
  constructor (core) {
    this.config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: (core) => {
          const config = core.getConfig()

          config.paths.flow = __dirname

          const projectConfigFile = this.getProjectConfigFile(configFileNames)

          config.flow = {
            configFilePath: projectConfigFile !== '' ? projectConfigFile : path.join(config.paths.flow, defaultConfigFileName),
          }
        }
      },
      {
        command: 'flow',
        handler: flowHandler
      },
      {
        command: 'build',
        handler: function (core) {
          flowHandler(core)
        }
      },
      {
        command: 'watchWebpackJs',
        handler: function (core) {
          flowHandler(core)
        }
      }
    ]
  }

  getProjectConfigFile (fileNames) {
    const fs = require('fs')
    for (const fileName of fileNames) {
      const testPath = path.join(this.config.paths.project, fileName)
      if (fs.existsSync(testPath)) {
        return testPath
      }
    }

    return ''
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = Flow
