const fs = require('fs')
const path = require('path')

const configFileNames = ['.babelrc', '.babelrc.js', 'babel.config.js']

class Babel {
  constructor (core) {
    this.config = core.getConfig()
    this.projectPackageJson = require(path.join(this.config.paths.project, 'package.json'))

    this.listeners = [
      {
        command: 'config',
        priority: -10,
        handler: (core) => {
          const config = core.getConfig()
          const cliTools = core.getCliTools()

          if (!config.webpackConfig || !config.webpackConfig.module || !config.webpackConfig.module.rules) {
            cliTools.warn('Babel is configured to integrate into webpack but there is no webpack config availbale')
            return
          }

          const babelLoaderConfig = {
            loader: 'babel-loader',
            options: this.getLoaderOptions()
          }

          for (const rule of config.webpackConfig.module.rules) {
            if (rule.test.toString() === /\.js$/.toString()) {
              if (rule.use && Object.prototype.toString.call(rule.use).slice(8, -1) !== 'Array') {
                cliTools.warn('Babel wants to inject its loader into the js loaders \'use\' array, but couldn\'t find it')
                return
              }

              rule.use.unshift(babelLoaderConfig)
              return
            }
          }

          cliTools.warn('Babel didn\'t find the js loader to inject its loader')
        }
      }
    ]
  }

  getLoaderOptions () {
    if (!this.isConfigAvailableInProject) {
      return {
        presets: ['@babel/preset-env']
      }
    }

    return {}
  }

  isConfigAvailableInProject () {
    if (this.projectPackageJson.hasOwnProperty('babel')) {
      return true
    }

    return this.isOneOfFilesExistingInProjectRoot()
  }

  isOneOfFilesExistingInProjectRoot () {
    for (const fileName of configFileNames) {
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

module.exports = Babel
