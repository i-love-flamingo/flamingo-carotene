const glob = require('glob')
const path = require('path')

const pugBuild = (core, files) => {

  const config = core.getConfig()
  const cliTools = core.getCliTools()
  core.getJobmanager().addJob('pug', 'Pug Compile', 'pug')

  files = files || glob.sync(config.paths.pug.src + config.pug.filesPattern)

  // removing duplicates...
  const normalizedFiles = {}
  for (const file of files) {
    const normFile = path.normalize(file)
    normalizedFiles[normFile] = true
  }
  let allFiles = Object.keys(normalizedFiles);


  if (cliTools.getOptionValue('page')) {
    const pageFilter = new RegExp(cliTools.getOptionValue('page'))
    const filteredFiles = []
    for (const file of allFiles) {
      if (pageFilter.test(file)) {
        filteredFiles.push(file)
      }
    }
    allFiles = filteredFiles
  }

  const jobParameters = []
  jobParameters.push('flamingo-carotene-pug')
  jobParameters.push(path.resolve(config.paths.src)) // sourceDir
  jobParameters.push(path.resolve(config.paths.pug.dist)) // distDir
  jobParameters.push(path.join(config.paths.project, 'node_modules')) // nodeDir


  // leave 1 cpu core unused...
  const threadCount = (require('os').cpus().length || 2) - 1

  const jobArrays = chunkifyArray(allFiles, threadCount)


  core.getJobmanager().setSubJobTotalCount('pug', jobArrays.length)
  let results = [];
  let errors = [];
  let finishedSubJobs = 0;


  // starting jobs...
  for (const jobArray of jobArrays) {

    const jobFileList = []
    for (const file of jobArray) {
      jobFileList.push(path.relative(path.resolve(config.paths.src), file)) // nodeDir
    }

    const childProcess = core.getSpawner().spawnJobNpx(jobParameters.concat(jobFileList))

    childProcess.stdout.on('data', function (data) {
      results.push(data)
    })

    childProcess.stderr.on('data', function (data) {
      errors.push(data)
    })

    childProcess.on('exit', (code) => {
      finishedSubJobs++
      core.getJobmanager().setSubJobProgress('pug', finishedSubJobs)

      if (finishedSubJobs >= jobArrays.length) {
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


function chunkifyArray(a, n, balanced) {

  if (n < 2)
    return [a];

  var len = a.length,
    out = [],
    i = 0,
    size;

  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  }

  else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  }

  else {

    n--;
    size = Math.floor(len / n);
    if (len % size === 0)
      size--;
    while (i < size * n) {
      out.push(a.slice(i, i += size));
    }
    out.push(a.slice(size * n));

  }

  return out;
}





module.exports = pugBuild
