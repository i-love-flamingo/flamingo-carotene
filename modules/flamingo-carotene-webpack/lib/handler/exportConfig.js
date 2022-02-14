const webpackBuildHandler = require('../build')
const fs = require('fs')

const webpackExportConfig = function (core) {
  const config = core.getConfig()

  let data = JSON.stringify(config.webpackConfig, null, 4);
  fs.writeFileSync('webpack.config.json', data);

  core.getCliTools().info(`Webpack Config was exported to ./webpack.config.json`)



}

module.exports = webpackExportConfig
