const { spawn, execSync } = require('child_process')

/**
 * Executes the es lint
 * @param core
 */
const eslint = (core) => {
  const cliTools = core.getCliTools()
  const config = core.getConfig()

  const npmVersion = execSync('npm -v')

  core.getJobmanager().addJob('eslint', 'ES-Lint')
  // cliTools.info('ESLint - start')
  const childProcess = core.getSpawner().spawnJobNpx(getCommandParameters(config))

  // this is new
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

    // Don't need current cmd
    if (data.toString().trim().search('/.bin/eslint') !== -1) {
      skipLine = true
    }

    // Skip line when only console codes should be written - should come from the prettified eslint output
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

  childProcess.on('error', function (exception) {
    console.log('An Error occured while ES Linting:', exception)
  })

  childProcess.on('exit', function (code) {
    core.getJobmanager().finishJob('eslint')
    const output = [].concat(results, errors).join('\n').trim()

    if (output.length > 0) {
      if (code !== 0) {
        cliTools.warn(output)
      } else {
        cliTools.info(output)
      }
    }

    if (config.eslint.breakOnError && errors.length > 0) {
      core.reportError(`ESLint report errors.`)
    }
  })
}

/**
 * Get the parameters for the cli lint command
 * @param config
 * @returns {string[]}
 */
const getCommandParameters = function (config) {
  const parameters = [
    'eslint'
  ]

  if (config.eslint.configFilePath !== null) {
    parameters.push('--config', config.eslint.configFilePath)
  }

  if (config.eslint.ignoreFilePath !== null) {
    parameters.push('--ignore-path', config.eslint.ignoreFilePath)
  }

  return parameters.concat([
    '--ext',
    '.js',
    '.'
  ])
}

module.exports = eslint
