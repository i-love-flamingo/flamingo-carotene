const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const {buildI18nHandler, entriesHandler} = require('lib/handler/build')


class FlamingoCaroteneVueJs {
  constructor (core) {
    this.config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        handler: function (core) {
          const config = core.getConfig()
          // Create paths for internationalization
          config.paths.vueI18n = path.join(config.paths.src, '..', '..', 'translations', 'merged')
          config.paths.generated = path.join(config.paths.src, '..', 'generated')

          // Create internationalized translations
          buildI18nHandler(core)

          // Add vue to the list of extensions WebPack should resolve file names to
          config.webpackConfig.resolve.extensions = [
            ...config.webpackConfig.resolve.extensions,
            '.vue'
          ]

          // Add new loaders for Vue and Pug/Vue compatibility
          config.webpackConfig.module.rules = [
            ...config.webpackConfig.module.rules,
            {
              test: /\.pug$/,
              use: [
                {
                  loader: 'pug-plain-loader',
                  options: {
                    basedir: path.join(config.paths.webpack.src, '../'),
                  },
                },
              ],
            },
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
          ]

          // Add Vue Loader Plugin
          config.webpackConfig.plugins = [
            ...config.webpackConfig.plugins,
            new VueLoaderPlugin(),
          ]

          // Entries are updated with internationalized translations paths
          config.webpackConfig.entry = {
            ...config.webpackConfig.entry,
            ...entriesHandler(),
          }
        }
      },
      {
        command: 'translate',
        description: 'Builds internationalized file for VueJs',
        handler: function (core) {
          buildI18nHandler(core)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneVueJs
