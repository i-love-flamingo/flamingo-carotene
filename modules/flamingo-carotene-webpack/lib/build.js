
const webpackBuild = function (core, jobId, jobLabel, jobGroup) {
  const config = core.getConfig()
  const cliTools = core.getCliTools()



  if (!config.webpackConfig) {
    cliTools.warn('No webpack config found')
    return
  }

  // cliTools.info(`Webpack config used to build:\r\n${cliTools.inspect(config.webpackConfig)}`, true)

  // cliTools.info('Webpack - start')

  core.getJobmanager().addJob(jobId, jobLabel, jobGroup)
  core.getJobmanager().setSubJobTotalCount(jobId, 100)

  cliTools.info(`Running webpack in mode: ${config.webpackConfig.mode}`, true)

  const timeStarted = new Date().getTime()
  const webpack = require('webpack')

  const ProgressPlugin = require('webpack/lib/ProgressPlugin');
  config.webpackConfig.plugins.push(new ProgressPlugin(function(percentage, message, ...args) {
    // console.info(percentage, message, ...args);
    core.getJobmanager().setSubJobProgress(jobId, Math.round(percentage * 100 ))
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
    // cliTools.info(`Webpack - end\r\n    Finished after ${new Date().getTime() - timeStarted}ms`)

    if (config.webpack && typeof config.webpack.buildCallback === 'function') {
      config.webpack.buildCallback(core)
    }
  })
}

module.exports = webpackBuild
