const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const pug = require('pug')

let cfg
let cli

const generateAst = (file, callback) => {
  const filename = path.relative(cfg.paths.src, file)
  const templateFilename = path.relative(cfg.paths.pug.src, file)
  const astFile = path.join(cfg.paths.pug.dist, templateFilename.replace('.pug', '.ast.json'))
  const content = fs.readFileSync(file, 'utf8')

  pug.compile(content, {
    filename,
    basedir: cfg.paths.src,
    plugins: [
      {
        preCodeGen (ast, options) {
          cli.log(`        > ${filename}`, true)

          mkdirp(path.dirname(astFile), () => {
            const astJson = JSON.stringify(ast, null, ' ').replace(new RegExp(cfg.paths.src + '/', 'g'), '')
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

const pugBuild = (config, cliTools) => {
  cfg = config
  cli = cliTools

  const timeStarted = (new Date()).getTime()

  cliTools.info('Run pug')

  glob(cfg.paths.pug.src + cfg.pug.filesPattern, (error, files) => {
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
