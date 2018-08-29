const path = require('path')

const shell = require('shelljs')
const webpack = require('webpack')

const webpackBuild = function (core) {
  const config = core.getConfig()
  const cliTools = core.getCliTools()

  if (!config.webpackConfig) {
    cliTools.warn('No webpack config found')
    return
  }

  // cliTools.info(`Webpack config used to build:\r\n${cliTools.inspect(config.webpackConfig)}`, true)

  cliTools.info('Run webpack')

  cliTools.info(`Running webpack in mode: ${config.webpackConfig.mode}`, true)

  webpack(config.webpackConfig, (error, stats) => {
    if (error) {
      cliTools.warn(error.stack || error);
      if (error.details) {
        cliTools.warn(error.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      cliTools.warn(info.errors);
    }

    if (stats.hasWarnings()) {
      cliTools.warn(info.warnings);
    }
  })
}

module.exports = webpackBuild
