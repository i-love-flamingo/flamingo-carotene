const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const sassLint = (core) => {
  const cliTools = core.getCliTools()
  const config = core.getConfig()

  const timeStarted = new Date().getTime()

  // trying to find sass lint in project folder..
  let configFile = path.join(config.paths.project, '.sass-lint.yml')

  // if not exists, take standard one
  if (!fs.existsSync(configFile)) {
    configFile = path.join(config.paths.sassLint, '.sass-lint.yml')
  }

  let cmd = `yarn`
  if (process.platform === 'win32') {
    cmd = `yarn.cmd`
  }

  const parameters = ['sass-lint', '--config', `${configFile}`, '--no-exit', '-v']

  cliTools.info('SassLint - start')

  const spawnEnv = process.env
  spawnEnv.FORCE_COLOR = true

  const childProcess = spawn(
    cmd,
    parameters,
    {
      env: spawnEnv
    }
  )

  // this is new

  const results = []
  const errors = []

  childProcess.stdout.on('data', function (data) {
    // ignore first result line... - cause its the cmd itself

    let skipLine = false

    // dont need "yarn run" info
    if (data.toString().trim().search('yarn run v') !== -1) {
      skipLine = true
    }

    // dont need current cmd
    if (data.toString().trim().search(/[\/\\]\.bin[\/\\]sass-lint --config/) !== -1) {
      skipLine = true
    }

    // Skip line when only console codes should be written - should come from the prettified sass-lint output
    if (data == '\u001B[2K' || data == '\u001B[1G') {
      skipLine = true
    }

    if (!skipLine) {
      results.push(data)
    }
  })

  childProcess.stderr.on('data', function (data) {
    errors.push(data)
  })

  childProcess.on('exit', (code) => {
    const output = [`SassLint - end\r\n    Finished after ${new Date().getTime() - timeStarted}ms`].concat(results, errors).join('\n').trim()

    if (code !== 0) {
      cliTools.warn(output)
    } else {
      cliTools.info(output)
    }

    if (config.sassLint.breakOnError && errors.length > 0) {
      core.reportError(`SassLint report errors.`)
    }
  })
}

module.exports = sassLint
