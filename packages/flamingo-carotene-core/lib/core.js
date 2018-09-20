const path = require('path')
const fs = require('fs')

let config = null
let cliTools = null
let dispatcher = null
let modules = null

let errors = []

class Core {

  getConfig () {
    if (config !== null) {
      return config
    }

    const Config = require('./config')
    config = new Config().getConfig()

    return config
  }

  getCliTools () {
    if (cliTools !== null) {
      return cliTools
    }

    const CliTools = require('./cliTools')
    cliTools = new CliTools()

    return cliTools
  }

  getDispatcher () {
    if (dispatcher !== null) {
      return dispatcher
    }

    const Dispatcher = require('./dispatcher')
    dispatcher = new Dispatcher()

    return dispatcher
  }

  reportError (error) {
    errors.push(error)
  }

  getErrors () {
    return errors
  }

  hasErrors () {
    return (errors.length > 0)
  }

  getModules () {
    if (modules !== null) {
      return modules
    }

    // Ensure config and cliTools when loading modules
    this.getConfig()
    this.getCliTools()

    modules = []

    // Get carotene modules of dependencies
    for (const moduleName of config.caroteneModuleNames) {
      const modulePath = path.join(config.paths.project, 'node_modules', moduleName, 'caroteneModule.js')

      if (!fs.existsSync(modulePath)) {
        cliTools.log(cliTools.chalk.dim(`No carotene module file found in module ${moduleName}`), true)
        continue
      }

      const Module = require(modulePath)

      modules.push(new Module(this))
    }

    // Get carotene module of project
    const projectModulePath = path.join(config.paths.project, 'caroteneModule.js')

    if (!fs.existsSync(projectModulePath)) {
      cliTools.log(cliTools.chalk.dim(`No carotene module file found in project`), true)
    } else {
      const Module = require(projectModulePath)

      modules.push(new Module(this))
    }

    cliTools.info(`Carotene modules:\r\n${cliTools.inspect(modules, {depth: 0})}`, true)

    return modules
  }
}

module.exports = new Core()
