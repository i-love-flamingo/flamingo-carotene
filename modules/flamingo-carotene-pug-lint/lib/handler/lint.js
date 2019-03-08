const {spawn} = require('child_process')
const path = require('path')
const fs = require('fs')
const glob = require('glob')

// limit cmd length (note: windows cmd has a limit of 8000 chars)
const maxShellCmdLimit = 7000;

const pugLint = (core) => {
  const cliTools = core.getCliTools()
  const config = core.getConfig()

  const timeStarted = new Date().getTime()

  // trying to find sass lint in project folder..
  let configFile = path.posix.join(config.paths.project, '.pug-lintrc.js')

  // if not exists, take standard one
  if (!fs.existsSync(configFile)) {
    configFile = path.posix.join(config.paths.pugLint, '.pug-lintrc.js')
  }

  // get all files to be linted...
  const files = []
  glob.sync(`${config.paths.src}/${config.pugLint.filesPattern}`).forEach((file) => {
    files.push(path.posix.normalize(file))
  })

  // create shell cmd "packages" (respect maxShellCmdLimit)
  const lintFilePacks = []
  let packNumber = 0
  for (let file of files) {
    if (!lintFilePacks[packNumber]) {
      lintFilePacks[packNumber] = []
    }
    if (lintFilePacks[packNumber].join('').length > maxShellCmdLimit) {
      packNumber++
      lintFilePacks[packNumber] = []
    }
    lintFilePacks[packNumber].push(file)
  }

  core.getJobmanager().addJob('puglint', 'Pug-Lint')
  cliTools.info(`PugLint - start (${files.length} files in ${lintFilePacks.length} packages)`)

  const results = []
  const errors = []
  let finishedPacks = 0;

  // spawn puglint for each pack
  for (let lintFilePackIndex in lintFilePacks) {
    const lintFilePack = lintFilePacks[lintFilePackIndex];
    const lintPackNumber = parseInt(lintFilePackIndex, 10) + 1;
    cliTools.info(`Start PugLint-Pack ${lintPackNumber} with ${lintFilePack.length} files...`, true);

    const childProcess = core.getSpawner().spawnJobNpx(['pug-lint', '--config', configFile].concat(lintFilePack))

    childProcess.stdout.on('data', function (data) {
      results.push(data)
    })

    childProcess.stderr.on('data', function (data) {
      const errorPrefix = `${config.paths.project}/`
      const lines = data.toString().split("\n").map((line) => {
        if (line.includes(errorPrefix)) {
          return `⚠️   ${line.split(errorPrefix).join('')}`
        }
        return line
      })
      errors.push(lines.join("\n"))
    })

    childProcess.on('exit', (code) => {
      finishedPacks++;
      cliTools.info(`Finished PugLint-Pack ${lintPackNumber} - (${finishedPacks} of ${lintFilePacks.length})`, true);

      // if every pack is finished
      if (finishedPacks >= lintFilePacks.length) {
        core.getJobmanager().finishJob('puglint')
        const output = [`PugLint-Lint End\r\n    Finished after ${new Date().getTime() - timeStarted}ms`].concat(results, errors).join('\n').trim()

        if (code !== 0) {
          cliTools.warn(output)
        } else {
          cliTools.info(output)
        }

        if (config.pugLint.breakOnError && errors.length > 0) {
          core.reportError(`PugLint report errors.`)
        }
      }
    })
  }
}

module.exports = pugLint
