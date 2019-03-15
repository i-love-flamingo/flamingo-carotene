const glob = require('glob')
const path = require('path')

const pugBuild = (core) => {

  const config = core.getConfig()
  const cliTools = core.getCliTools()
  core.getJobmanager().addJob('pug', 'Pug Compile', )

  const files = glob.sync(config.paths.pug.src + config.pug.filesPattern)

  // removing duplicates...
  const normalizedFiles = {}
  for (const file of files) {
    const normFile = path.normalize(file)
    normalizedFiles[normFile] = true
  }
  const allFiles = Object.keys(normalizedFiles);


  core.getJobmanager().setSubJobTotalCount('pug', allFiles.length)
  let results = [];
  let errors = [];
  let finishedSubJobs = 0;
  const basedir = path.normalize(config.paths.src)

  for (const file of allFiles) {

    const sourceFile = path.resolve(config.paths.src, file)
    const templateFilename = path.relative(config.paths.pug.src, file)
    const targetFile = path.resolve(path.join(config.paths.pug.dist, templateFilename.replace('.pug', '.ast.json')))
    const nodeModulesPath = path.join(config.paths.project, 'node_modules')
    const childProcess = core.getSpawner().spawnJobNpx(['pugCompile', basedir, templateFilename, sourceFile, targetFile, nodeModulesPath]);

    childProcess.stdout.on('data', function (data) {
      results.push(data)
    })

    childProcess.stderr.on('data', function (data) {
      errors.push(data)
    })

    childProcess.on('exit', (code) => {
      finishedSubJobs++
      core.getJobmanager().setSubJobProgress('pug', finishedSubJobs)

      if (finishedSubJobs >= allFiles.length) {
        core.getJobmanager().finishJob('pug')

        const output = [].concat(results, errors).join('\n').trim()

        if (output.length > 0) {
          if (code !== 0) {
            cliTools.warn(output)
          } else {
            cliTools.info(output)
          }
        }
      }
    })
  }
}

module.exports = pugBuild
