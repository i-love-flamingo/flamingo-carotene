
const webpackBuild = function (core, jobId, jobLabel, jobGroup) {
  const config = core.getConfig()
  const cliTools = core.getCliTools()
  const fs = require('fs');


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

  // ProgressPlugin
  config.webpackConfig.plugins.push(new ProgressPlugin(function(percentage, message, ...args) {
    core.getJobmanager().setSubJobProgress(jobId, Math.round(percentage * 100 ))
  }))

  // HardSource Cache
  if (config.webpackCacheConfig) {
    const cacheConfig = Object.assign(config.webpackCacheConfig, {
      cacheDirectory: path.join(config.paths.webpackCache, jobId)
    });
    config.webpackConfig.plugins.push(new HardSourceWebpackPlugin(cacheConfig))
  }

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

    if (cliTools.hasOption(['--analyzeBundle'])) {
      fs.writeFile("stats.json", JSON.stringify(info), function (err) {
        if (err) {
          return cliTools.warn('Cant output stats.json');
        }
      });
    }

    if (config.webpack && typeof config.webpack.buildCallback === 'function') {
      config.webpack.buildCallback(core)
    }
  })
}

module.exports = webpackBuild
