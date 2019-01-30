const path = require('path')
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

          config.eslint = {
            useWebpackLoader: true,
            breakOnError: false,
            configFilePath: this.isConfigAvailableInProject() ? null : path.join(config.paths.eslint, defaultConfigFileName),
            ignoreFilePath: this.isIgnoreConfigAvailableInProject() ? null : path.join(config.paths.eslint, defaultIgnoreFileName)
          }
        }
      },
      {
        command: 'config',
        priority: -50,
        handler: function (core) {
          const config = core.getConfig()
          const cliTools = core.getCliTools()

          if (!config.eslint.useWebpackLoader) {
            return
          }

          if (!config.webpackConfig || !config.webpackConfig.module || !config.webpackConfig.module.rules) {
            cliTools.warn('ESLint is configured to use a webpack loader but there is no webpack config availbale')
            return
          }

          const loaderConfig = {
            enforce: 'pre',
            test: /\.js$/,
            loader: 'eslint-loader',
            exclude: /node_modules/,
            options: {
              emitWarning: true
            }
          }

          // When break on error config is set, set configs to break the webpack compiler and fail the process
          if (config.eslint.breakOnError) {
            loaderConfig.options.emitWarning = false
            loaderConfig.options.failOnError = true
          }

          config.webpackConfig.module.rules.push(loaderConfig)
        }
      },
      {
        command: 'lint',
        handler: lintHandler
      },
      {
        command: 'build',
        priority: 10,
        handler: function (core) {
          // Set break on error configs to true for production build
          const config = core.getConfig()

          config.eslint.breakOnError = true

          if (config.eslint.useWebpackLoader) {
            for (const rule of config.webpackConfig.module.rules) {
              if (rule.loader && rule.loader === 'eslint-loader') {
                rule.options = rule.options || {}
                rule.options.emitWarning = false
                rule.options.failOnError = true

                break
              }
            }
          }
        }
      },
      {
        command: 'build',
        handler: function (core) {
          // Run the standalone linter
          const config = core.getConfig()

          if (!config.eslint.useWebpackLoader) {
            lintHandler(core)
          }
        }
      },
      {
        command: 'watchWebpackJs',
        handler: function (core) {
          // Run the standalone linter
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
    const fs = require('fs')
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
