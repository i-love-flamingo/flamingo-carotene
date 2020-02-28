#!/usr/bin/env node
const shell = require('shelljs')
const core = require('./core')
const cliTools = core.getCliTools()
const config = core.getConfig()
const dispatcher = core.getDispatcher()
const command = cliTools.getCommand()

if (command === 'help' || typeof command === "undefined" || command.charAt(0) === '-') {
  cliTools.showUsage()
  cliTools.exit()
}

if (command === 'build') {
  shell.rm('-rf', config.paths.dist)

  if (config.paths.webpackCache) {
    shell.rm('-rf', config.paths.webpackCache)
  }
}

if (!dispatcher.commandExists(command)) {
  cliTools.warn(`Command doesn't exist`)
  cliTools.exit()
}

dispatcher.dispatchCommand('config')

// Print the current configuration if config is run
if (command === 'config') {
  cliTools.log(cliTools.inspect(config))
}
// If the command is not config, run it too
else {
  dispatcher.dispatchCommand(command)
}

// check reported core-errors - and exit
process.on('exit', () => {
  if (core.hasErrors()) {
    const error = core.getErrors().join('\n')
    cliTools.error(`Flamingo Carotene finished - with errors:\n${error}`)
    cliTools.exit(1)
  } else {
    cliTools.info('Flamingo Carotene finished - successfully')
  }
})
