const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const shell = require('shelljs')

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
          resolve: resolveTemplatePath,
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

const copyAsset = (srcFileName, callback) => {
  const assetSrcBasePath = path.join(config.paths.src,'asset')
  const assetTargetBasePath = path.join(config.paths.dist,'asset')
  const relativeFileName = path.relative(assetSrcBasePath, srcFileName)
  const targetFileName = path.join(assetTargetBasePath, relativeFileName)
  try {
    mkdirp(path.dirname(targetFileName), () => {
      cliTools.log(`        asset > ${srcFileName} to ${targetFileName}`, true)
    shell.cp(srcFileName, targetFileName)
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

  if (config.pug.staticAssetPattern != "") {
    const assetSrcBasePath = path.join(config.paths.src,'asset')
    const assetTargetBasePath = path.join(config.paths.dist,'asset')
    // Copy assets
    mkdirp(assetTargetBasePath, function (err) {
      if (err) console.error(err)
      glob(assetSrcBasePath + config.pug.staticAssetPattern, (error, files) => {
          if (error) {
            complete(error)
            return
          }
          const threadCount = require('os').cpus().length || 2
          cliTools.info('Pug copy static assets - start')
        async.mapLimit(files, threadCount, copyAsset, (error, results) => {
            if (error) {
              complete(error)
              return
            }
            cliTools.info(`Pug copy static assets - end\r\n   Finished after ${new Date().getTime() - timeStarted}ms`)
          complete()
        })
      })
    })
  }
}

module.exports = pugBuild
