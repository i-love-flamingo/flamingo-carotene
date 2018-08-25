const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

const cliTools = require('./cliTools')
const config = require('./config')
const Dispatcher = require('./dispatcher')

class Carotene {
  constructor () {
    this.modules = this.getModules()

    this.dispatcher = new Dispatcher(this.modules)

    this.executeCommand('config')

    if (cliTools.getCommand() === 'build') {
      shell.rm('-rf', config.paths.dist)
    }

    if (cliTools.getCommand() !== 'config') {
      this.executeCommand(cliTools.getCommand())
    }
  }

  getModules () {
    const modules = []

    // Get carotene modules of dependencies
    for (const moduleName of config.caroteneModuleNames) {
      const modulePath = path.join(config.paths.project, 'node_modules', moduleName, 'caroteneModule.js')

      if (!fs.existsSync(modulePath)) {
        cliTools.log(cliTools.chalk.dim(`No carotene module file found in module ${moduleName}`), true)
        continue
      }

      const Module = require(modulePath)

      modules.push(new Module(config, cliTools))
    }

    // Get carotene module of project
    const projectModulePath = path.join(config.paths.project, 'caroteneModule.js')

    if (!fs.existsSync(projectModulePath)) {
      cliTools.log(cliTools.chalk.dim(`No carotene module file found in project`), true)
    } else {
      const Module = require(projectModulePath)

      modules.push(new Module(config, cliTools))
    }

    cliTools.info(`Carotene modules:\r\n${cliTools.inspect(modules, {depth: 0})}`, true)

    return modules
  }

  executeCommand (command) {
    cliTools.info(`Execute command: ${command}`)

    this.dispatcher.dispatchCommand(command)
  }
}

module.exports = Carotene
