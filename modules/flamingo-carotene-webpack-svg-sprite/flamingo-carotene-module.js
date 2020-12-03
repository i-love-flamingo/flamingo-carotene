const path = require('path')
const SvgStorePlugin  = require('./lib/SvgStorePlugin.js')

class FlamingoCaroteneWebpackSvgSprite {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        handler: function (core) {
          const config = core.getConfig()

          config.webpackConfig.resolve = Object.assign({ modules: [] }, config.webpackConfig.resolve)
          config.webpackConfig.resolve.modules.unshift(path.join(path.resolve(__dirname, 'node_modules')))
          config.webpackConfig.resolveLoader = Object.assign({ modules: [] }, config.webpackConfig.resolveLoader)
          config.webpackConfig.resolveLoader.modules.unshift(path.join(path.resolve(__dirname, 'node_modules')))

          config.webpackConfig.module.rules = [
            ...config.webpackConfig.module.rules,
            {
              test: /\.svg$/,
              use: [
                {
                  loader: SvgStorePlugin.loader,
                  options: {
                    name: 'svgIcons/svgIconSprite.[hash:5].svg',
                    iconName: '[name]'
                  }
                }
              ]
            }
          ]

          const svgSpritePluginInstance = new SvgStorePlugin({
            sprite: {
              startX: 10,
              startY: 10,
              deltaX: 20,
              deltaY: 20,
              iconHeight: 20
            }
          })
          config.webpackConfig.plugins.push(svgSpritePluginInstance)
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneWebpackSvgSprite
