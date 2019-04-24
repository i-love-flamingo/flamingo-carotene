const webpackBuildHandler = require('../build')

const webpackBuildAll = function (core) {
  webpackBuildHandler(core, 'webpackAll', 'Webpack (Complete)', 'webpack')
}

module.exports = webpackBuildAll
