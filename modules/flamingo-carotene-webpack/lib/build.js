
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
    core.getJobmanager().reportFinishJob(jobId)

    if (error) {
      cliTools.warn(error.stack || error)
      if (error.details) {
        cliTools.warn(error.details)
      }
      core.reportError(`Webpack report errors.`)
    }

    const statsData = stats.toJson()

    if (stats.hasErrors() || stats.hasWarnings()) {
      for (const error of statsData.errors) {
        cliTools.warn(error)
      }
      for (const warnings of statsData.warnings) {
        cliTools.warn(warnings)
      }
      core.reportError(`WebpackStat report errors.`)
    }

    if (cliTools.hasOption(['--writeWebpackStats'])) {
      const statsFilePath =  path.resolve('./stats.json')
      cliTools.info(`Writing statistics to ${statsFilePath}`)
      fs.writeFile(statsFilePath, JSON.stringify(statsData), function (err) {
        if (err) {
          return cliTools.warn('Cant output stats.json');
        }
      });
    }

    if (config.webpack && typeof config.webpack.buildCallback === 'function') {
      config.webpack.buildCallback(core)
    }

    core.getJobmanager().finishJob(jobId)
  })
}

module.exports = webpackBuild
