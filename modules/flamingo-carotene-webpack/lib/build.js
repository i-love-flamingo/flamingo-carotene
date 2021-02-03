
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
    config.webpackConfig.plugins.push(new HardSourceWebpackPlugin.ExcludeModulePlugin([
      {
        // HardSource works with mini-css-extract-plugin but due to how
        // mini-css emits assets, assets are not emitted on repeated builds with
        // mini-css and hard-source together. Ignoring the mini-css loader
        // modules, but not the other css loader modules, excludes the modules
        // that mini-css needs rebuilt to output assets every time.
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
      }
    ]))
  }

  webpack(config.webpackConfig, (error, stats) => {
    core.getJobmanager().reportFinishJob(jobId)

    if (error) {
      cliTools.error(error.stack || error)
      if (error.details) {
        cliTools.error(error.details)
      }
      core.reportError('Webpack reports errors.')
    }

    const statsData = stats.toJson()

    if (stats.hasWarnings()) {
      statsData.warnings.forEach(warning => cliTools.warn(warning))
      statsData.children.forEach(child => child.warnings.forEach(warning => cliTools.warn(warning)))

      core.reportBuildNotes('WebpackStat reports build notes.')
    }

    if (stats.hasErrors()) {
      statsData.errors.forEach(error => cliTools.error(error))
      statsData.children.forEach(child => child.errors.forEach(error => cliTools.error(error)))

      core.reportError('WebpackStat reports errors.')
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
