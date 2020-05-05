const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')

class FlamingoCaroteneVueJs {
  constructor (core) {
    this.config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        handler: function (core) {
          const config = core.getConfig()

          config.webpackConfig.resolve.extensions = [
            ...config.webpackConfig.resolve.extensions,
            '.vue'
          ]

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

          config.webpackConfig.plugins = [
            ...config.webpackConfig.plugins,
            new VueLoaderPlugin(),
          ]
        }
      },
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneVueJs
