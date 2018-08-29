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

  pug.compile(content, {
    filename,
    basedir: config.paths.src,
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
}

const pugBuild = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  const timeStarted = (new Date()).getTime()

  cliTools.info('Run pug')

  glob(config.paths.pug.src + config.pug.filesPattern, (error, files) => {
    if (error) {
      cliTools.warn(`Error: ${error}`)
      return
    }

    const threadCount = require('os').cpus().length || 2

    cliTools.info(`Processing template files`, true)

    async.mapLimit(files, threadCount, generateAst, (error, results) => {
      if (error) {
        cliTools.warn(`Error: ${error}`)
        return
      }

      const timeTaken = (new Date()).getTime() - timeStarted
      cliTools.info(`Generated ${results.length} AST file(s) in: ${timeTaken}ms`, true)
    })
  })
}

module.exports = pugBuild
