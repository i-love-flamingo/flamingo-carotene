const SvgStorePlugin  = require('external-svg-sprite-loader')

class FlamingoCaroteneWebpackSvgSprite {
  constructor (core) {
    this.listeners = [
      {
        command: 'config',
        handler: function (core) {
          const config = core.getConfig()
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
