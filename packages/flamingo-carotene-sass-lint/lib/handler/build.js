const exec = require('child_process').exec
const path = require('path')

const sassLint = (core) => {

  const cliTools = core.getCliTools()
  const config = core.getConfig()

  const cmd = `yarn sass-lint --config ${path.join(config.paths.project, '.sass-lint.yml')} --no-exit -v`
  cliTools.info(cmd)


  const childProcess = exec(cmd, err => {
    if (err) {
      throw err
    }
  })

  childProcess.stdout.pipe(process.stdout)
  childProcess.stderr.pipe(process.stderr)
}

module.exports = sassLint
