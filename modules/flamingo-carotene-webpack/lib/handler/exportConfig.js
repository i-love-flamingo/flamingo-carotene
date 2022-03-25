const webpackBuildHandler = require('../build')
const fs = require('fs')

const webpackExportConfig = function (core) {
  const config = core.getConfig()

  const fs = require('fs')
  const serialize = require('serialize-javascript');

  const data = serialize(config.webpackConfig, {
    'ignoreFunction': true,
    'space': 2,
    'unsafe': true
  });

  fs.writeFileSync('webpack.config.js', data);

  core.getCliTools().info(`Webpack Config was exported to ./webpack.config.js`)
}

module.exports = webpackExportConfig
