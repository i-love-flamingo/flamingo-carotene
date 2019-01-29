const path = require('path')
const fs = require('fs')

const initialConfig = require('./initialConfig')
const core = require('./core')

const cliTools = core.getCliTools()

const modulePattern = 'flamingo-carotene-'

class Config {
  constructor () {
    cliTools.info(`Initialize config`)
    this.config = initialConfig
    this.config.moduleNames = this.getModuleNames()
  }

  getConfig () {
    return this.config
  }

  /**
   * Get all Flamingo Carotene module names used in the project
   * @returns {Array}
   */
  getModuleNames () {
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

    const moduleNames = []

    for (const dependency of dependencies) {
      if (dependency.startsWith(modulePattern) && dependency !== `${modulePattern}core`) {
        moduleNames.push(dependency)
      }
    }

    cliTools.info(`Used Flamingo Carotene modules:\r\n${cliTools.inspect(moduleNames)}`, true)

    return moduleNames
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
