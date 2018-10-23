const path = require('path')
const fs = require('fs')

const lintHandler = require('./lib/handler/lint')

const configFileNames = ['.eslintrc', '.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json']
const ignoreFileNames = ['.eslintignore']

const defaultConfigFileName = '.eslintrc.js'
const defaultIgnoreFileName = '.eslintignore'

// class CarotenePug extends CaroteneModule {
class ESLint {
  constructor (core) {
    // super(core)
    this.listeners = [
      {
        command: 'config',
        priority: 100,
        handler: function (core) {
          const config = core.getConfig()

          config.paths.eslint = __dirname

          config.eslint = {}
          config.eslint.useWebpackLoader = true
          config.eslint.breakOnError = false
          config.eslint.configFilePath = getESLintFilePath(configFileNames, defaultConfigFileName, config)
          config.eslint.ignoreFilePath = getESLintFilePath(ignoreFileNames, defaultIgnoreFileName, config)
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
                {
                  loader: 'eslint-loader',
                  options: {
                    quiet: true
                  }
                }
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

  getListeners () {
    return this.listeners
  }
}

/**
 * Loads a config file from the project and if there does not exist such a config file, a default file will be loaded.
 * @param fileNames Array of file names to check
 * @param defaultFileName Name of the default file located in this package
 * @param config The flamingo carotene config
 */
getESLintFilePath = (fileNames, defaultFileName, config) => {
  for (const fileName of fileNames) {
    const filePath = path.join(config.paths.project, fileName)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return path.join(config.paths.esLint, defaultFileName)
}

module.exports = ESLint
