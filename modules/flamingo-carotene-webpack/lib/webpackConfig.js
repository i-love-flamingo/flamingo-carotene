const path = require('path')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'

class WebpackConfig {
  constructor(core) {
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()
  }

  getCacheConfig () {
    if (process.env.NODE_ENV === 'development') {
      return {
        info: {
          // 'none' or 'test'.
          mode: 'none',
          // 'debug', 'log', 'info', 'warn', or 'error'.
          level: (this.cliTools.isVerbose() ? 'debug' : 'error'),
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
      }
    }

    return null
  }

  getWebpackConfig () {

    let mode = isProd ? 'production' : 'development'
    if (this.cliTools.hasOption(['--forceDev'])) {
      mode = 'development'
    }

    const webpackConfig = {
      target: 'web',
      stats: 'verbose',
      // context: config.paths.src,
      mode: mode,
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
      resolveLoader: {
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
            type: 'asset/resource'
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)(\?.*)?$/,
            type: 'asset/resource'
          }
        ]
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              enforce: true
            }
          }
        },
        minimize: (mode !== 'development'),
        minimizer: [
          new CssMinimizerPlugin(),
          new TerserPlugin({
            // cache: true,
            parallel: true,
            extractComments: (mode !== 'development'),
            terserOptions: {
              sourceMap: (mode === 'development'),
              // Compression specific options
              compress: {
                // Drop console statements
                drop_console: (mode !== 'development')
              },
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
        new WebpackManifestPlugin()
      ]
    }

    if (!isProd) {
      webpackConfig['devtool'] = 'source-map'
    }

    if (this.cliTools.hasOption(['--analyzeBundle'])) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
      webpackConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: path.join(this.config.paths.project, 'webpackBundleAnalyze.html'),
        openAnalyzer: true
      }))
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
    const include = [path.posix.normalize(this.config.paths.src)]

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
    return [
      {
        loader: MiniCssExtractPlugin.loader,
        options: this.getMiniCssExtractLoaderOptions()
      },
      {
        loader: 'css-loader',
        options: {}
      },
      {
        loader: 'sass-loader',
        options: {
          implementation: this.getSassImplementation(),
          sassOptions: {
            includePaths: [
              path.join(this.config.paths.project, 'node_modules')
            ]
          }
        }
      },
    ]
  }

  getSassImplementation() {
    return require('sass')
  }

  getMiniCssExtractLoaderOptions () {
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
