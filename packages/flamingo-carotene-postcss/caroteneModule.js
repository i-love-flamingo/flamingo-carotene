const fs = require('fs')
const path = require('path')

const configFileNames = ['.postcssrc', '.postcssrc.json', '.postcssrc.yml', '.postcssrc.js', 'postcss.config.js']

class PostCSS {
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
            cliTools.warn('PostCSS is configured to integrate into webpack but there is no webpack config availbale')
            return
          }

          let loaderConfig = 'postcss-loader'

          if (!this.isConfigAvailableInProject()) {
            loaderConfig = {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')
                ]
              }
            }
          }

          for (const rule of config.webpackConfig.module.rules) {
            if (rule.test.toString() === /\.(sa|sc|c)ss$/.toString()) {
              if (rule.use && Object.prototype.toString.call(rule.use).slice(8, -1) !== 'Array') {
                cliTools.warn('PostCSS wants to inject its loader into the style rules \'use\' array, but couldn\'t find it')
                return
              }

              const postcssLoaderIndex = rule.use.indexOf('css-loader') + 1

              rule.use.splice(Math.min(rule.use.length, postcssLoaderIndex), 0, loaderConfig)
              return
            }
          }

          cliTools.warn('PostCSS didn\'t find the style rule to inject its loader')
        }
      }
    ]
  }

  isConfigAvailableInProject () {
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

module.exports = PostCSS
