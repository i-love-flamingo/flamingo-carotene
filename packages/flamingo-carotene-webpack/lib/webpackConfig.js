const fs = require('fs')
const path = require('path')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require('webpack-manifest-plugin')

const isProd = !process.env.NODE_ENV || process.env.NODE_ENV === 'production'

const postcssConfigFileNames = ['.postcssrc', '.postcssrc.json', '.postcssrc.yml', '.postcssrc.js', 'postcss.config.js']

const browserslistConfigFileNames = ['.browserslistrc', 'browserslist']

const eslintConfigFileNames = ['.eslintrc', '.eslintrc.js', '.eslintrc.yaml', '.eslintrc.yml', '.eslintrc.json']

const babelConfigFileNames = ['.babelrc', '.babelrc.js', 'babel.config.js']

class WebpackConfig {
  constructor(core) {
    this.config = core.getConfig()
    this.cliTools = core.getCliTools()

    this.projectPackageJson = require(path.join(this.config.paths.project, 'package.json'))

    this.postcssConfigDetected = null
    this.browserslistConfigDetected = null
    this.eslintConfigDetected = null
    this.babelConfigDetected = null

    this.detectProjectConfigs()

    return this.getWebpackConfig()
  }

  detectProjectConfigs () {
    this.detectPostcssConfig()

    this.detectBrowserslistConfig()

    this.detectEslintConfig()

    this.detectBabelConfig()

    this.cliTools.info(`Configs detected:\r\n` +
      `        postcss      -> ${this.postcssConfigDetected}\r\n` +
      `        browserslist -> ${this.browserslistConfigDetected}\r\n` +
      `        eslint       -> ${this.eslintConfigDetected}\r\n` +
      `        babel        -> ${this.babelConfigDetected}`, true)
  }

  detectPostcssConfig () {
    this.postcssConfigDetected = this.isOneOfFilesExistingInProjectRoot(postcssConfigFileNames)
  }

  detectBrowserslistConfig () {
    this.browserslistConfigDetected = false

    if (this.projectPackageJson.hasOwnProperty('browserslist')) {
      this.browserslistConfigDetected = true
      return
    }

    this.browserslistConfigDetected = this.isOneOfFilesExistingInProjectRoot(browserslistConfigFileNames)
  }

  detectEslintConfig () {
    this.eslintConfigDetected = false

    if (this.projectPackageJson.hasOwnProperty('eslintConfig')) {
      this.eslintConfigDetected = true
      return
    }

    this.eslintConfigDetected = this.isOneOfFilesExistingInProjectRoot(eslintConfigFileNames)
  }

  detectBabelConfig () {
    this.babelConfigDetected = false

    if (this.projectPackageJson.hasOwnProperty('babel')) {
      this.babelConfigDetected = true
      return
    }

    this.babelConfigDetected = this.isOneOfFilesExistingInProjectRoot(babelConfigFileNames)
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
            sourceMap: true
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
      return include.concat(this.config.webpack.rulesInclude)
    }

    return include
  }

  getJsLoaders () {
    const loaders = [
      {
        loader: 'babel-loader',
        options: this.getBabelLoaderOptions()
      },
      'import-glob'
    ]

    if (this.eslintConfigDetected) {
      loaders.push({
        loader: 'eslint-loader',
        // options: {
        //   parser: 'babel-eslint',
        // }
      })
    }

    return loaders
  }

  getBabelLoaderOptions () {
    if (!this.babelConfigDetected) {
      return {
        presets: ['env']
      }
    }

    return {}
  }

  getStyleLoaders () {
    const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: this.getMiniCssExtractPluginOptions()
      },
      'css-loader'
    ]

    if (this.postcssConfigDetected) {
      loaders.push('postcss-loader')
    } else {
      loaders.push({
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')
          ]
        }
      })
    }

    return loaders.concat([
      'sass-loader',
      'import-glob'
    ])
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
