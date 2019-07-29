const path = require('path')
const fs = require('fs')

let config = null
let configObject = null
let spawner = null
let cliTools = null
let dispatcher = null
let modules = null
let jobmanager = null
let dictionary = null
let errors = []

class Core {
  getConfig () {
    if (config !== null) {
      return config
    }

    config = this.getConfigObject().getConfig()

    return config
  }

  getConfigObject() {
    if (configObject !== null) {
      return configObject
    }

    const Config = require('./config')
    configObject = new Config()

    return configObject
  }

  getSpawner () {
    if (spawner !== null) {
      return spawner
    }

    spawner = require('./spawner')
    return spawner
  }

  getJobmanager () {
    if (jobmanager !== null) {
      return jobmanager
    }

    jobmanager = require('./jobmanager')
    return jobmanager
  }

  getDictionary () {
    if (dictionary !== null) {
      return dictionary
    }

    dictionary = require('./commandDictionary')
    return dictionary
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

    // Get Flamingo Carotene modules of dependencies
    for (const moduleName of config.moduleNames) {
      const modulePath = path.join(config.paths.project, 'node_modules', moduleName, 'flamingo-carotene-module.js')

      if (!fs.existsSync(modulePath)) {
        cliTools.log(cliTools.chalk.dim(`No Flamingo Carotene module file found in module ${moduleName}`), true)
        continue
      }

      const Module = require(modulePath)
      let moduleInstance = new Module(this)
      moduleInstance.name = moduleName
      modules.push(moduleInstance)
    }

    // Get Flamingo Carotene module of project
    const projectModulePath = path.join(config.paths.project, 'flamingo-carotene-module.js')

    if (!fs.existsSync(projectModulePath)) {
      cliTools.log(cliTools.chalk.dim(`No Flamingo Carotene module file found in project`), true)
    } else {
      const Module = require(projectModulePath)
      let moduleInstance = new Module(this)
      moduleInstance.name = 'Project'
      modules.push(moduleInstance)
    }

    cliTools.info(`Flamingo Carotene modules:\r\n${cliTools.inspect(modules, {depth: 0})}`, true)

    this.getDictionary()

    return modules
  }
}

module.exports = new Core()
