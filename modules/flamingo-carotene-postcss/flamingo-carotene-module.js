const fs = require('fs')
const path = require('path')

const configFileNames = ['.postcssrc', '.postcssrc.json', '.postcssrc.yml', '.postcssrc.js', 'postcss.config.js']

class PostCSS {
  constructor (core) {
    this.config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: -10,
        handler: (core) => {
          const config = core.getConfig()
          const cliTools = core.getCliTools()

          const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'

          if (!config.webpackConfig || !config.webpackConfig.module || !config.webpackConfig.module.rules) {
            cliTools.warn('PostCSS is configured to integrate into webpack but there is no webpack config availbale')
            return
          }

          config.webpackConfig.resolve = Object.assign({ modules: [] }, config.webpackConfig.resolve)
          config.webpackConfig.resolve.modules.unshift(path.join(path.resolve(__dirname, 'node_modules')))
          config.webpackConfig.resolveLoader = Object.assign({ modules: [] }, config.webpackConfig.resolveLoader)
          config.webpackConfig.resolveLoader.modules.unshift(path.join(path.resolve(__dirname, 'node_modules')))

          const loaderConfig = {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {}
            }
          }

          if (!this.isConfigAvailableInProject()) {
            loaderConfig.options.postcssOptions = {
              plugins: [
                require('autoprefixer')
              ]
            }
          }

          if (!isProd) {
            loaderConfig.options.sourceMap = true
          }

          for (const rule of config.webpackConfig.module.rules) {
            if (rule.test.toString() === /\.(sa|sc|c)ss$/.toString()) {
              if (rule.use && Object.prototype.toString.call(rule.use).slice(8, -1) !== 'Array') {
                cliTools.warn('PostCSS wants to inject its loader into the style rules \'use\' array, but couldn\'t find it')
                return
              }

              // Lookup the css-loader to place PostCSS loader after it
              let postcssLoaderIndex = null
              for (let loaderIndex = 0; loaderIndex < rule.use.length; loaderIndex++) {
                const loader = rule.use[loaderIndex]
                if (typeof(loader) === 'string') {
                  if (loader === 'css-loader') {
                    postcssLoaderIndex = loaderIndex + 1
                    break
                  }
                  continue
                }

                if (typeof(loader) === 'object' && loader.loader === 'css-loader') {
                  postcssLoaderIndex = loaderIndex + 1
                  break
                }
              }

              if (postcssLoaderIndex === null) {
                cliTools.warn('PostCSS wants to inject its loader after the css-loader, but couldn\'t find it')
                return
              }

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
