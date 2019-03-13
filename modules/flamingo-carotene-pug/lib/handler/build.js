const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

let config
let cliTools

let allTimeCompile = 0

/**
 * Resolves extended and included template paths.
 * Paths that start with a tilde `~` will resolve to the projects `/node_modules/` folder. (usage: `~module-name/path/to/template`)
 * @param filename
 * @param source
 * @param options
 * @returns {*}
 */
const resolveTemplatePath = (filename, source, options) => {
  if (filename[0] === '~') {
    return path.join(path.join(config.paths.project, 'node_modules'), filename.slice(1))
  }

  return path.join(filename[0] === '/' ? options.basedir : path.dirname(source.trim()), filename)
}

function StopCompileException(message) {
  this.message = 'Enough work for Flamingo Carotene. AST Received. Save time. Quit Compile! '+ message;
}
StopCompileException.prototype = new Error()

const generateAst = (file, callback) => {
  const startComp = new Date().getTime();

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

  const endComp = new Date().getTime();
  const compTime =endComp - startComp

  allTimeCompile+= compTime
  // console.log(`Build Time ${compTime}ms for ${file} - alltime: ${allTimeCompile}`)
}

const compileAllFiles = (allFiles, complete) => {

  // compile all files...
  for (const file of allFiles) {
    cliTools.info(`Processing template files`, file)
    generateAst(file, function(error, results) {
      if (error) {
        complete(error)
        return
      }

      complete()
    })
  }
}

const pugBuild = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  const timeStarted = new Date().getTime()

  cliTools.info('Pug - start')
  core.getJobmanager().addJob('pug', 'Pug Compile')

  const complete = (error) => {
    cliTools.info(`Pug - end\r\n    Generated ${Object.keys(allFiles).length} AST file(s)\r\n    Finished after ${new Date().getTime() - timeStarted}ms`)
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

  // config.pug.filesPattern = '/{*,.,*/page/*}/{*,.,*/*.partial}/category.pug'

  const files = glob.sync(config.paths.pug.src + config.pug.filesPattern)

  // removing duplicates...
  const normalizedFiles = {}
  for (const file of files) {
    const normFile = path.normalize(file)
    normalizedFiles[normFile] = true
  }
  const allFiles = Object.keys(normalizedFiles);

  setTimeout(function() {
    compileAllFiles(allFiles, complete)
  })

}

module.exports = pugBuild
