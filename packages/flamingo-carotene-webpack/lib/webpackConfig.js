const fs = require('fs')
const path = require('path')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin')

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'

const browserslistConfigFileNames = ['.browserslistrc', 'browserslist']

class WebpackConfig {
  constructor(core) {
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()

    this.projectPackageJson = require(path.join(this.config.paths.project, 'package.json'))

    this.browserslistConfigDetected = null

    this.detectProjectConfigs()

    return this.getWebpackConfig()
  }

  detectProjectConfigs () {
    this.detectBrowserslistConfig()

    this.cliTools.info(`Configs detected:\r\n` +
      `        browserslist -> ${this.browserslistConfigDetected}`, true)
  }

  detectBrowserslistConfig () {
    this.browserslistConfigDetected = false

    if (this.projectPackageJson.hasOwnProperty('browserslist')) {
      this.browserslistConfigDetected = true
      return
    }

    this.browserslistConfigDetected = this.isOneOfFilesExistingInProjectRoot(browserslistConfigFileNames)
  }

  isOneOfFilesExistingInProjectRoot (fileNames) {
    for (const fileName of fileNames) {
      if (fs.existsSync(path.join(this.config.paths.project, fileName))) {
        return true
      }
    }

    return false
  }

  getWebpackConfig () {
    const webpackConfig = {
      target: 'web',
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
      fileName = path.join(this.config.webpack.dist.cssFolderName, fileName)
    }

    return fileName
  }

  getFontFileName () {
    // For shorter hash: 'font/[name].[sha512:hash:base64:7].[ext]'
    let fileName = isProd ? '[name].[hash].[ext]' : '[name].[ext]'

    if (this.config.webpack.dist.fontFolderName) {
      fileName = path.join(this.config.webpack.dist.fontFolderName, fileName)
    }

    return fileName
  }

  getImageFileName () {
    // For shorter hash: name: 'img/[name].[sha512:hash:base64:7].[ext]'
    let fileName = isProd ? '[name].[hash].[ext]' : '[name].[ext]'

    if (this.config.webpack.dist.imageFolderName) {
      fileName = path.join(this.config.webpack.dist.imageFolderName, fileName)
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
    return [
      {
        loader: MiniCssExtractPlugin.loader,
        options: this.getMiniCssExtractPluginOptions()
      },
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          includePaths: [
            path.join(this.config.paths.project, 'node_modules')
          ]
        }
      },
      'import-glob'
    ]
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
