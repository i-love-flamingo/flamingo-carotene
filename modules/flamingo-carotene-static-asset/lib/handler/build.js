const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const path = require('path')
const shell = require('shelljs')

let config
let cliTools

const generateCopyAsset = (destPath) => {
  cliTools.info(path.dirname(destPath))
  return (srcFileName, callback) => {
    try {
      mkdirp(path.dirname(destPath), () => {
        cliTools.log(`        asset > ${srcFileName} to ${destPath}`, true)
        // shell.cp(srcFileName, destPath)
      })
    } catch (e) {
      cliTools.warn(e)
      callback(e, null)
    }
  }
}

const globFiles = (filePath, destPath) => {
  glob(filePath, (error, files) => {
    if (error) {
      cliTools.warn(error)
      return
    }

    const threadCount = require('os').cpus().length || 2
    async.mapLimit(files, threadCount, generateCopyAsset(destPath), (error, results) => {
      if (error) {
        cliTools.warn(error)
        return
      }
    })
  })
}

const build = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  if (config.staticAsset.link) {
    const assetSrcBasePath = config.staticAsset.paths.src
    const assetTargetBasePath = config.staticAsset.paths.dist

    // Copy assets
    mkdirp(assetTargetBasePath, function (err) {
      if (err) {
        cliTools.warn(error)
      }

      cliTools.info('Copy static assets - start')
      const timeStarted = new Date().getTime()

      config.staticAsset.link.forEach((currentLinks) => {
        globFiles(path.join(assetSrcBasePath, currentLinks.src), path.join(assetTargetBasePath, currentLinks.dist))
      })

      cliTools.info(`Copy static assets - end\r\n   Finished after ${new Date().getTime() - timeStarted}ms`)
    })
  }
}

module.exports = build
