#!/usr/bin/env node

const path = require('path')

const cliTools = require('./cliTools')

const command = cliTools.getCommand()

if (!command || command.charAt(0) === '-') {
  cliTools.showUsage()
  cliTools.exit()
}

const Carotene = require('./carotene')

new Carotene()
