const path = require('path')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'

class WebpackConfig {
  constructor(core) {
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
    return this.getWebpackConfig()
  }

  getWebpackConfig () {
    const webpackConfig = {
      target: 'web',
      stats: 'verbose',
      // context: config.paths.src,
      mode: isProd ? 'production' : 'development',
      entry: path.join(this.config.paths.webpack.src, 'index.js'),
      output: {
        path: this.config.paths.webpackDist,
        filename: this.getOutputFileName(),
        publicPath: this.config.webpack.publicPath || '/'
      },
      resolve: {
        modules: [
            this.config.paths.src,
            path.join(this.config.paths.project, 'node_modules')
        ]
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            include: this.getRulesInclude(),
            use: this.getJsLoaders()
          },
          {
            test: /\.(sa|sc|c)ss$/,
            include: this.getRulesInclude(),
            use: this.getStyleLoaders()
          },
          {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            include: this.getRulesInclude(),
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: this.getImageFileName()
                }
              }
            ]
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
            include: this.getRulesInclude(),
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 1000,
                  name: this.getFontFileName()
                }
              }
            ]
          }
        ]
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all'
            }
          }
        },
        minimizer: [
          new OptimizeCSSAssetsPlugin({}),
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
              keep_fnames: true // Needed for IE11 and behaviors - otherwise the IE cannot differentiate the behavior names
            }
          }),
        ]
      },
      plugins: [
        // See: https://webpack.js.org/plugins/mini-css-extract-plugin/
        new MiniCssExtractPlugin({
          filename: this.getCssFileName()
        }),
        new ManifestPlugin()
      ]
    }

    if (this.cliTools.isExperimental()) {
      webpackConfig.plugins.push(new HardSourceWebpackPlugin({
        cacheDirectory: path.join(this.config.paths.project, '.cache'),
        info: {
          // 'none' or 'test'.
          mode: 'none',
          // 'debug', 'log', 'info', 'warn', or 'error'.
          level: (isProd ? 'error' : 'debug'),
        },
        // Clean up large, old caches automatically.
        cachePrune: {
          // Caches younger than `maxAge` are not considered for deletion. They must
          // be at least this (default: 2 days) old in milliseconds.
          maxAge: 2 * 24 * 60 * 60 * 1000,
          // All caches together must be larger than `sizeThreshold` before any
          // caches will be deleted. Together they must be at least this
          // (default: 50 MB) big in bytes.
          sizeThreshold: 50 * 1024 * 1024
        }
      }));
    }

    if (!isProd) {
      webpackConfig['devtool'] = 'source-map'
    }

    return webpackConfig
  }

  getOutputFileName () {
    let fileName = isProd ? '[name].[contenthash].js' : '[name].js'

    if (this.config.webpack.dist.jsFolderName) {
      fileName = path.join(this.config.webpack.dist.jsFolderName, fileName)
    }

    return fileName
  }

  getCssFileName () {
    let fileName = isProd ? '[name].[contenthash].css' : '[name].css'

    if (this.config.webpack.dist.cssFolderName) {
      fileName = path.posix.join(this.config.webpack.dist.cssFolderName, fileName)
    }

    return fileName
  }

  getFontFileName () {
    // For shorter hash: 'font/[name].[sha512:hash:base64:7].[ext]'
    let fileName = isProd ? '[name].[hash].[ext]' : '[name].[ext]'

    if (this.config.webpack.dist.fontFolderName) {
      fileName = path.posix.join(this.config.webpack.dist.fontFolderName, fileName)
    }

    return fileName
  }

  getImageFileName () {
    // For shorter hash: name: 'img/[name].[sha512:hash:base64:7].[ext]'
    let fileName = isProd ? '[name].[hash].[ext]' : '[name].[ext]'

    if (this.config.webpack.dist.imageFolderName) {
      fileName = path.posix.join(this.config.webpack.dist.imageFolderName, fileName)
    }

    return fileName
  }

  getRulesInclude () {
    const include = [this.config.paths.src]

    if (this.config.webpack.rulesInclude && Array.isArray(this.config.webpack.rulesInclude)) {
      // Concat the arrays and remove doubles
      return include.concat(this.config.webpack.rulesInclude).filter(function (value, index, self) {
        return self.indexOf(value) === index
      })
    }

    return include
  }

  getJsLoaders () {
    return [
      'import-glob'
    ]
  }

  getStyleLoaders () {
    let styleLoaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: this.getMiniCssExtractPluginOptions()
      },
      {
        loader: 'css-loader',
        options: {}
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [
            path.join(this.config.paths.project, 'node_modules')
          ]
        }
      },
      {
        loader: 'import-glob',
        options: {}
      }
    ]

    if (!isProd) {
      styleLoaders.forEach((styleLoader) => {
        styleLoader.options.sourceMap = true
      })
    }

    return styleLoaders
  }

  getMiniCssExtractPluginOptions () {
    const pluginOptions = {}

    if (this.config.webpack.dist.cssFolderName) {
      const cssDirName = path.dirname(path.join(this.config.paths.dist, this.getCssFileName()))

      const relativeDistPath = path.relative(cssDirName, this.config.paths.dist)

      pluginOptions['publicPath'] = relativeDistPath + '/'
    }

    return pluginOptions
  }
}

module.exports = WebpackConfig
