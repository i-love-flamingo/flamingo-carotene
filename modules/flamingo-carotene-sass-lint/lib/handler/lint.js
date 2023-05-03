const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const sassLint = (core) => {
  const cliTools = core.getCliTools()
  const config = core.getConfig()
  const npmVersion = execSync('npm -v').toString().trim()

  core.getJobmanager().addJob('sasslint', 'SASS-Lint', 'webpackCss')
  const childProcess = core.getSpawner().spawnJobNpx(getCommandParameters(config))

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
    console.log(output)

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

    cliTools.info('SassLint - params: ' + getCommandParameters(config).join(' '))

    core.getJobmanager().finishJob('sasslint')

  })
}

/**
 * Get the parameters for the cli lint command
 * @param config
 * @returns {string[]}
 */
const getCommandParameters = function (config) {
  const parameters = [
    'stylelint'
  ]

  // trying to find sass lint in project folder...
  let configFilePath = path.join(config.paths.project, '.stylelintrc.json')

  // if not exists, take standard one
  if (!fs.existsSync(configFilePath)) {
    configFilePath = path.join(config.paths.sassLint, '.stylelintrc.yml')
  }

  if (configFilePath !== null) {
    parameters.push('--config', configFilePath)
  }

  if (config.sassLint.ignoreFilePath) {
    parameters.push('--ignore-path', config.sassLint.ignoreFilePath)
  }

  if (config.sassLint.hasOwnProperty('additionalShellParameters') && config.sassLint.additionalShellParameters.length > 0) {
    for (const param of config.sassLint.additionalShellParameters) {
      parameters.push(param)
    }
  }

  if (config.sassLint.hasOwnProperty('fixErrors') && config.sassLint.fixErrors) {
    parameters.push('--fix')
  }

  if (config.sassLint.hasOwnProperty('cache') && config.sassLint.cache) {
    parameters.push('--cache')
  }

  if (config.sassLint.hasOwnProperty('maxWarnings') && config.sassLint.maxWarnings) {
    parameters.push('--mw', config.sassLint.maxWarnings)
  }

  parameters.push(config.sassLint.fileInclude)

  return parameters
}

module.exports = sassLint
