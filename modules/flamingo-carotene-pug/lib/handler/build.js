const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

/*
let config
let cliTools

let allTimeCompile = 0

*/

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

  setTimeout(function() {
    compileAllFiles(allFiles, complete)
  })

  // Compile all...
  const compileAllFiles = (allFiles, complete) => {

    // compile all files...
    for (const file of allFiles) {
      cliTools.info(`Processing template files`, file)
      generateAst(file, function(error, results) {
        if (error) {
          complete(error)
          return null
        }

      })
    }
    complete()
  }

  const resolveTemplatePath = (filename, source, options) => {
    if (filename[0] === '~') {
      return path.join(path.join(config.paths.project, 'node_modules'), filename.slice(1))
    }

    return path.join(filename[0] === '/' ? options.basedir : path.dirname(source.trim()), filename)
  }

  // Compile AST
  const generateAst = (file, callback) => {
    const filename = path.relative(config.paths.src, file)
    const templateFilename = path.relative(config.paths.pug.src, file)
    const astFile = path.join(config.paths.pug.dist, templateFilename.replace('.pug', '.ast.json'))
    const content = fs.readFileSync(file, 'utf8')
    const pug = require('pug')
    try {
      pug.compile(content, {
        filename,
        basedir: config.paths.src,
        compileDebug: false,
        plugins: [
          {
            resolve: resolveTemplatePath,
            preCodeGen(ast, options) {
              cliTools.log(`        > ${filename}`, true)

              mkdirp(path.dirname(astFile), () => {
                const astJson = JSON.stringify(ast, null, ' ').replace(new RegExp(config.paths.src + '/', 'g'), '')
                fs.writeFile(astFile, astJson, (err, info) => {
                  callback(err, info)
                })
              })
              core.getJobmanager().incSubJobProgress('pug')

              throw new StopCompileException()
            }
          }
        ]
      })
    } catch (e) {
      if (e instanceof StopCompileException) {
        // DONT CATCH
      } else {
        callback(e, null)
      }
    }
  }

  function StopCompileException(message) {
    this.message = 'Enough work for Flamingo Carotene. AST Received. Save time. Quit Compile! '+ message;
  }
  StopCompileException.prototype = new Error()



  const complete = (error) => {
    core.getJobmanager().finishJob('pug')

    if (error) {
      cliTools.warn(`Pug error:\n${error}`)
      if (config.pug.breakOnError) {
        core.reportError('Pug reported error.')
      }
    }

    if (config.pug && typeof config.pug.buildCallback === 'function') {
      config.pug.buildCallback(core)
    }
  }


}

module.exports = pugBuild
