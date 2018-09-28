const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

let config
let cliTools

const generateAst = (file, callback) => {
  const filename = path.relative(config.paths.src, file)
  const templateFilename = path.relative(config.paths.pug.src, file)
  const astFile = path.join(config.paths.pug.dist, templateFilename.replace('.pug', '.ast.json'))
  const content = fs.readFileSync(file, 'utf8')
  try {
    pug.compile(content, {
      filename,
      basedir: config.paths.src,
      compileDebug: true,
      plugins: [
        {
          preCodeGen (ast, options) {
            cliTools.log(`        > ${filename}`, true)

            mkdirp(path.dirname(astFile), () => {
              const astJson = JSON.stringify(ast, null, ' ').replace(new RegExp(config.paths.src + '/', 'g'), '')
              fs.writeFile(astFile, astJson, (err, info) => {
                callback(err, info)
              })
            })

            return ast
          }
        }
      ]
    })
  } catch (e) {
    callback(e, null)
  }
}

const pugBuild = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  const timeStarted = new Date().getTime()

  cliTools.info('Pug - start')

  const complete = (error) => {
    if (error) {
      cliTools.warn(`Pug error:\n${error}`)

      if (config.pug.breakOnError) {
        core.reportError('Pug reported error.')
      }
    }

    if (config.pug && typeof config.pug.callback === 'function') {
      config.pug.callback(core)
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
