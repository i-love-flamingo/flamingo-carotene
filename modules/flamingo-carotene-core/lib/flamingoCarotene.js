#!/usr/bin/env node
const shell = require('shelljs')
const core = require('./core')
const cliTools = core.getCliTools()
const config = core.getConfig()
const dispatcher = core.getDispatcher()
const command = cliTools.getCommand()

if (!command || command.charAt(0) === '-') {
  cliTools.showUsage()
  cliTools.exit()
}

dispatcher.dispatchCommand('config')

if (command === 'build') {
  shell.rm('-rf', config.paths.dist)
}

if (command !== 'config') {
  dispatcher.dispatchCommand(command)
}

// check reported core-errors - and exit
process.on('exit', () => {
  if (core.hasErrors()) {
    const error = core.getErrors().join('\n')
    cliTools.info(`Flamingo carotene finished - with errors:\n${error}`)
    cliTools.exit(1)
  } else {
    cliTools.info('Flamingo carotene finished - successfully')
  }
})
