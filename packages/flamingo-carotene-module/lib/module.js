const packageJson = require('../package.json')

class CaroteneModule {
  constructor (core) {
    this.cliTools = core.getCliTools()
  }

  getVersion () {
    return packageJson.version
  }

  validate () {
    this.cliTools.warn(`No module validation written yet`)
  }
}

module.exports = CaroteneModule
