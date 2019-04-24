const path = require('path')

const webpackBuildHandler = require('../build')

const cssExtensions = [ '.css', '.scss', '.sass' ]

const webpackBuildCss = function (core) {
  const config = core.getConfig()

  if (typeof config.entry === 'object') {
    const cssEntries = {}

    for (const entryName in config.entry) {
      const entryConfig = config.entry[entryName]

      if (typeof entryConfig === 'string') {
        if (cssExtensions.indexOf(path.extname(entryConfig)) !== -1) {
          cssEntries[entryName] = entryConfig
          continue
        }
      }

      if (Array.isArray(entryConfig)) {
        for (const entryConfigItem of entryConfig) {
          if (cssExtensions.indexOf(path.extname(entryConfigItem)) !== -1) {
            cssEntries[entryName] = cssEntries[entryName] || []
            cssEntries[entryName].push(entryConfigItem)
          }
        }
      }
    }

    // ToDo:
    //  - Override entry and restore it after build
    //  - Restore all not set entries in manifest after build
    // config.entry = cssEntries
  }

  webpackBuildHandler(core, 'webpackCss', 'Webpack (Css)', 'webpackCss')
}

module.exports = webpackBuildCss
