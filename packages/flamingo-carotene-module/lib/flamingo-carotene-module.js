const packageJson = require('./package.json')

class CaroteneModule {
  constructor (config, cliTools) {
    this.config = config
    this.cliTools = cliTools
  }

  getVersion () {
    return packageJson.version
  }

  validate () {
    this.cliTools.warn(`No module validation written yet`)
  }
}

module.exports = CaroteneModule
