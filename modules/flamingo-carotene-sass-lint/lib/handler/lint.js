const { execSync } = require('child_process')
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



  const npmVersion = execSync('npm -v').toString().trim()

  core.getJobmanager().addJob('sasslint', 'SASS-Lint', 'webpackCss')
  // cliTools.info('SassLint - start')
  const childProcess = core.getSpawner().spawnJobNpx(['sass-lint', '--config', `${configFile}`, '--no-exit', '-v'])

  const results = []
  const errors = []

  childProcess.stdout.on('data', function (data) {
    // ignore first result line... - cause its the cmd itself

    let skipLine = false

    // Remove npm version from output
    if (data.toString().trim().search(npmVersion) !== -1) {
      skipLine = true
    }

    // dont need "yarn run" info
    if (data.toString().trim().search('yarn run v') !== -1) {
      skipLine = true
    }

    // dont need current cmd
    if (data.toString().trim().search(/[/\\]\.bin[/\\]sass-lint --config/) !== -1) {
      skipLine = true
    }

    // Skip line when only console codes should be written - should come from the prettified sass-lint output
    if (data === '\u001B[2K' || data === '\u001B[1G') {
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
    core.getJobmanager().reportFinishJob('sasslint')
    const output = [].concat(results, errors).join('\n').trim()

    if (output.length > 0) {
      if (code !== 0 || errors.length > 0) {
        if (config.sassLint.breakOnError) {
          cliTools.error(output)
          core.reportError('SassLint reports errors.')
        } else {
          cliTools.warn(output)
          core.reportBuildNotes('SassLint report notes.')
        }
      } else {
        cliTools.info(output)
      }
    }

    core.getJobmanager().finishJob('sasslint')

  })
}

module.exports = sassLint
