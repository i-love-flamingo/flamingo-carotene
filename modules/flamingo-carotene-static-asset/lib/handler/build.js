const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const path = require('path')
const shell = require('shelljs')

let config
let cliTools

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

const build = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  if (config.staticAsset.staticAssetPattern != "") {
    const assetSrcBasePath = path.join(config.paths.src,'asset')
    const assetTargetBasePath = path.join(config.paths.dist,'asset')
    // Copy assets
    mkdirp(assetTargetBasePath, function (err) {
      if (err) console.error(err)
      glob(assetSrcBasePath + config.staticAsset.staticAssetPattern, (error, files) => {
          if (error) {
            complete(error)
            return
          }
          const threadCount = require('os').cpus().length || 2
          cliTools.info('Copy static assets - start')
        async.mapLimit(files, threadCount, copyAsset, (error, results) => {
            if (error) {
              complete(error)
              return
            }
            cliTools.info(`Copy static assets - end\r\n   Finished after ${new Date().getTime() - timeStarted}ms`)
          complete()
        })
      })
    })
  }
}

module.exports = build
