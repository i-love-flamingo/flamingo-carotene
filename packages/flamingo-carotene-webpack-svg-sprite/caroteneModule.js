// class CaroteneWebpack extends CaroteneModule {
class FlamingoCaroteneWebpackSvgSprite {
  constructor (core) {
    // super(core)

    const config = core.getConfig()

    this.listeners = [
      {
        command: 'config',
        priority: -10,
        handler: function (core) {
          config.webpackConfig.module.rules = [
            ...config.webpackConfig.module.rules,
            {
              test: /\.svg$/,
              use: [
                {
                  loader: 'external-svg-sprite-loader',
                  options: {
                    name: 'svgIcons/svgIconSprite[hash:5].svg',
                    iconName: '[name]'
                  }
                }
              ]
            }
          ]

          const SvgStorePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin')
          config.webpackConfig.plugins.push(new SvgStorePlugin({
            sprite: {
              startX: 10,
              startY: 10,
              deltaX: 20,
              deltaY: 20,
              iconHeight: 20
            }
          }))
        }
      }
    ]
  }

  getListeners () {
    return this.listeners
  }
}

module.exports = FlamingoCaroteneWebpackSvgSprite
