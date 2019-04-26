
const webpackBuild = function (core, jobId, jobLabel, jobGroup) {
  const config = core.getConfig()
  const cliTools = core.getCliTools()

  if (!config.webpackConfig) {
    cliTools.warn('No webpack config found')
    return
  }

  core.getJobmanager().addJob(jobId, jobLabel, jobGroup)
  core.getJobmanager().setSubJobTotalCount(jobId, 100)

  cliTools.info(`Running webpack in mode: ${config.webpackConfig.mode}`, true)

  const webpack = require('webpack')
  const path = require('path')
  const ProgressPlugin = require('webpack/lib/ProgressPlugin');
  const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

  // Remove ProgressPlugin && HardSourceWebpackPlugin from plugins,
  // to get the chance to create new one...
  config.webpackConfig.plugins = config.webpackConfig.plugins.filter(function(plugin) {
    return !(plugin instanceof ProgressPlugin) && !(plugin instanceof HardSourceWebpackPlugin)
  });

  config.webpackConfig.plugins.push(new ProgressPlugin(function(percentage, message, ...args) {
    // console.info(percentage, message, ...args);
    core.getJobmanager().setSubJobProgress(jobId, Math.round(percentage * 100 ))
  }))

  config.webpackConfig.plugins.push(new HardSourceWebpackPlugin({
    cacheDirectory: path.join(config.paths.webpackCache, jobId),
    info: {
      // 'none' or 'test'.
      mode: 'none',
      // 'debug', 'log', 'info', 'warn', or 'error'.
      level: (cliTools.isVerbose() ? 'debug' : 'error'),
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
  }))

  webpack(config.webpackConfig, (error, stats) => {
    if (error) {
      cliTools.warn(error.stack || error)
      if (error.details) {
        cliTools.warn(error.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      cliTools.warn(info.errors)
    }

    if (stats.hasWarnings()) {
      cliTools.warn(info.warnings)
    }

    core.getJobmanager().finishJob(jobId)

    if (config.webpack && typeof config.webpack.buildCallback === 'function') {
      config.webpack.buildCallback(core)
    }
  })
}

module.exports = webpackBuild
