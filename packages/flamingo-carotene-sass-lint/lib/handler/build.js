const { spawn } = require('child_process');
const path = require('path')
const fs = require('fs')

const sassLint = (core) => {

  const cliTools = core.getCliTools()
  const config = core.getConfig()

  // trying to find sass lint in project folder..
  let configFile = path.join(config.paths.project, '.sass-lint.yml')

  // if not exists, take standard one
  if (!fs.existsSync(configFile)) {
    configFile = path.join(config.paths.sassLint, '.sass-lint.yml')
  }

  const cmd = `yarn`
  const parameters = ['sass-lint', '--config', `${configFile}`, '--no-exit', '-v']

  cliTools.info('SassLint - start')

  const childProcess = spawn(
    cmd,
    parameters,
    {
      env : {
        FORCE_COLOR: true
      }
    }
  )

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
    if (data.toString().trim().search('\/\.bin\/sass-lint --config') !== -1) {
      skipLine = true
    }

    if (!skipLine) {
      results.push(data)
    }
  });

  childProcess.stderr.on('data', function (data) {
    errors.push(data)
  })

  childProcess.on('close', (code) => {

    let output = 'SassLint - end\n'
    output += results.join('\n').trim()
    output += errors.join('\n').trim()

    if (code !== 0) {
      cliTools.warn(output)
    }
    else {
      cliTools.info(output)
    }
  });
}

module.exports = sassLint
