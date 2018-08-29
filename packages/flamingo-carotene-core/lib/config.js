const path = require('path')
const fs = require('fs')

const initialConfig = require('./initialConfig')
const core = require('./core')

const cliTools = core.getCliTools()

const caroteneLibPattern = 'flamingo-carotene-'

class Config {
  constructor () {
    cliTools.info(`Initialize config`)

    this.config = initialConfig

    this.config.caroteneModuleNames = this.getCaroteneModuleNames()
  }

  getConfig () {
    return this.config
  }

  /**
   * Get all carotene module names used in the project
   * @returns {Array}
   */
  getCaroteneModuleNames () {
    const projectPackageJson = this.getProjectPackageJson()

    const dependencies = []

    if (projectPackageJson.hasOwnProperty('dependencies')) {
      for (const dependency in projectPackageJson.dependencies) {
        dependencies.push(dependency)
      }
    }

    if (projectPackageJson.hasOwnProperty('devDependencies')) {
      for (const dependency in projectPackageJson.devDependencies) {
        dependencies.push(dependency)
      }
    }

    const caroteneModuleNames = []

    for (const dependency of dependencies) {
      if (dependency.startsWith(caroteneLibPattern) && dependency !== `${caroteneLibPattern}core`) {
        caroteneModuleNames.push(dependency)
      }
    }

    cliTools.info(`Used flamingo-carotene modules:\r\n${cliTools.inspect(caroteneModuleNames)}`, true)

    return caroteneModuleNames
  }

  /**
   * Get the projects package json file
   * @returns {*}
   */
  getProjectPackageJson () {
    const packageJsonPath = path.join(this.config.paths.project, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      cliTools.warn(`Error: Missing package.json file in: ${this.config.paths.project}`)
      cliTools.exit(1)
    }

    return require(packageJsonPath)
  }
}

module.exports = Config
