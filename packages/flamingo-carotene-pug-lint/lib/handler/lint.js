const {spawn} = require('child_process')
const path = require('path')
const fs = require('fs')
const glob = require('glob')

// limit cmd length (note: windows cmd has a limit of 8000 chars)
const maxShellCmdLimit = 7000;

const pugLint = (core) => {
  const cliTools = core.getCliTools()
  const config = core.getConfig()

  // trying to find sass lint in project folder..
  let configFile = path.join(config.paths.project, '.pug-lintrc.js')

  // if not exists, take standard one
  if (!fs.existsSync(configFile)) {
    configFile = path.join(config.paths.pugLint, '.pug-lintrc.js')
  }
  if (process.platform === 'win32') {
    configFile = configFile.split('\\').join('/')
  }

  // get all files to be linted...
  const files = []
  glob.sync(`${config.paths.src}/${config.pugLint.filesPattern}`).forEach((file) => {
    if (process.platform === 'win32') {
      files.push(file.split('\\').join('/'))
    }
    else {
      files.push(path.resolve(file))
    }
  })

  // get cmd
  let cmd = 'pug-lint'
  if (process.platform === 'win32') {
    cmd = `pug-lint.cmd`
  }

  cliTools.info(`PugLint - start (${files.length} files`)

  const spawnEnv = process.env
  spawnEnv.FORCE_COLOR = true

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



  const results = []
  const errors = []
  let finishedPacks = 0;

  // spawn puglint for each pack
  for (let lintFilePackIndex in lintFilePacks) {
    const lintFilePack = lintFilePacks[lintFilePackIndex];
    const lintPackNumber = parseInt(lintFilePackIndex, 10) + 1;
    cliTools.info(`Start PugLint-Pack ${lintPackNumber} with ${lintFilePack.length} files...`);

    const childProcess = spawn(cmd, ['--config', configFile].concat(lintFilePack), {env: spawnEnv})

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
      cliTools.info(`Finished PugLint-Pack ${lintPackNumber} - (${finishedPacks} of ${lintFilePacks.length})`);

      // if every pack is finished
      if (finishedPacks >= lintFilePacks.length) {
        const output = [`PugLint-Lint End`].concat(results, errors).join('\n').trim()

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
