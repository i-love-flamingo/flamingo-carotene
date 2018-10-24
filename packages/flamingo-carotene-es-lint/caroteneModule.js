const path = require('path')
const fs = require('fs')

const lintHandler = require('./lib/handler/lint')

const configFileNames = ['.eslintrc', '.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json']
const ignoreFileNames = ['.eslintignore']

const defaultConfigFileName = '.eslintrc.js'
const defaultIgnoreFileName = '.eslintignore'

class ESLint {
  constructor (core) {
    this.config = core.getConfig()
    this.projectPackageJson = require(path.join(this.config.paths.project, 'package.json'))

    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: (core) => {
          const config = core.getConfig()

          config.paths.eslint = __dirname

          config.eslint = {}
          config.eslint.useWebpackLoader = true
          config.eslint.breakOnError = false
          config.eslint.configFilePath = this.isConfigAvailableInProject() ? null : path.join(config.paths.eslint, defaultConfigFileName)
          config.eslint.ignoreFilePath = this.isIgnoreConfigAvailableInProject() ? null : path.join(config.paths.eslint, defaultIgnoreFileName)
        }
      },
      {
        command: 'config',
        priority: -50,
        handler: function (core) {
          const config = core.getConfig()
          const cliTools = core.getCliTools()

          if (config.eslint.useWebpackLoader) {
            if (!config.webpackConfig || !config.webpackConfig.module || !config.webpackConfig.module.rules) {
              cliTools.warn('ESLint is configured to use a webpack loader but there is no webpack config availbale')
              return
            }

            config.webpackConfig.module.rules.push({
              enforce: 'pre',
              test: /\.js$/,
              use: [
                'eslint-loader'
              ],
              exclude: /node_modules/
            })
          }
        }
      },
      {
        command: 'lint',
        handler: lintHandler
      },
      {
        command: 'build',
        handler: function (core) {
          const config = core.getConfig()

          if (!config.eslint.useWebpackLoader) {
            config.eslint.breakOnError = true
            lintHandler(core)
          }
        }
      },
      {
        command: 'watchWebpackJs',
        handler: function (core) {
          const config = core.getConfig()

          if (!config.eslint.useWebpackLoader) {
            lintHandler(core)
          }
        }
      }
    ]
  }

  isConfigAvailableInProject () {
    if (this.projectPackageJson.hasOwnProperty('eslintConfig')) {
      return true
    }

    return this.isOneOfFilesExistingInProjectRoot(configFileNames)
  }

  isIgnoreConfigAvailableInProject () {
    if (this.projectPackageJson.hasOwnProperty('eslintIgnore')) {
      return true
    }

    return this.isOneOfFilesExistingInProjectRoot(ignoreFileNames)
  }

  isOneOfFilesExistingInProjectRoot (fileNames) {
    for (const fileName of fileNames) {
      if (fs.existsSync(path.join(this.config.paths.project, fileName))) {
        return true
      }
    }

    return false
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = ESLint
