const path = require('path')

const webpackBuildHandler = require('../build')

const webpackBuildJs = function (core) {
  const config = core.getConfig()

  if (typeof config.entry === 'object') {
    const jsEntries = {}

    for (const entryName in config.entry) {
      const entryConfig = config.entry[entryName]

      if (typeof entryConfig === 'string') {
        if (path.extname(entryConfig) === '.js') {
          jsEntries[entryName] = entryConfig
          continue
        }
      }

      if (Array.isArray(entryConfig)) {
        for (const entryConfigItem of entryConfig) {
          if (path.extname(entryConfigItem) === '.js') {
            jsEntries[entryName] = jsEntries[entryName] || []
            jsEntries[entryName].push(entryConfigItem)
          }
        }
      }
    }

    // ToDo:
    //  - Override entry and restore it after build
    //  - Restore all not set entries in manifest after build
    // config.entry = jsEntries
  }

  webpackBuildHandler(core, 'webpackJs', 'Webpack (Js)', 'webpackJs')
}

module.exports = webpackBuildJs
