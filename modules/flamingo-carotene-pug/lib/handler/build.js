const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

let config
let cliTools

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
}

const pugBuild = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  const timeStarted = new Date().getTime()

  cliTools.info('Pug - start')
  core.getJobmanager().addJob('pug', 'Pug Compile')

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

  glob(config.paths.pug.src + config.pug.filesPattern, (error, files) => {
    if (error) {
      complete(error)
      return
    }

    const threadCount = require('os').cpus().length || 2

    cliTools.info(`Processing template files`, true)

    async.mapLimit(files, threadCount, generateAst, (error, results) => {
      if (error) {
        complete(error)
        return
      }

      cliTools.info(`Pug - end\r\n    Generated ${results.length} AST file(s)\r\n    Finished after ${new Date().getTime() - timeStarted}ms`)

      complete()
    })
  })
}

module.exports = pugBuild
