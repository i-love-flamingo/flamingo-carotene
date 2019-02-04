const glob = require('glob')
const async = require('async')
const mkdirp = require('mkdirp')
const path = require('path')
const shell = require('shelljs')
const os = require('os')

let config
let cliTools

/**
 * Creates an anonymous function for the async mapLimit that takes a destination path as an additional parameter. It then proceeds to copy the file to the destination path
 * @param destPath
 * @returns {Function}
 */
const generateCopyAsset = (destPath) => {
  return (srcFilePath, callback) => {
    try {
      mkdirp(path.dirname(destPath), () => {
        shell.cp('-r', srcFilePath, destPath)
      })
    } catch (e) {
      cliTools.warn(e)
      callback(e, null)
    }
  }
}

/**
 * Globs all files of srcPath and iterates through each of them asynchronously to copy them to destination path
 * @param srcPath
 * @param destPath
 * @returns {Promise<any>}
 */
const globFiles = (srcPath, destPath) => {
  return new Promise((resolve, reject) => {
    glob(srcPath, (error, files) => {
      if (error) {
        reject(error)
        return
      }

      const threadCount = os.cpus().length || 2
      async.mapLimit(files, threadCount, generateCopyAsset(destPath), (error, result) => {
        if (error) {
          reject(error)
        }
        resolve(result)
      })
    })
  })
}

/**
 * Main function that runs on build
 * @param core
 */
const build = (core) => {
  config = core.getConfig()
  cliTools = core.getCliTools()

  if (config.staticAsset.link) {
    const assetSrcBasePath = config.staticAsset.paths.src
    const assetTargetBasePath = config.staticAsset.paths.dist

    // Creates base directory
    mkdirp(assetTargetBasePath, function (err) {
      if (err) {
        cliTools.warn(error)
      }

      cliTools.info('Copy static assets - start')
      const timeStarted = new Date().getTime()

      // Loops through each item to glob
      config.staticAsset.link.forEach((currentLinks) => {
        // Globs files from current iterations of paths
        globFiles(path.join(assetSrcBasePath, currentLinks.src), path.join(assetTargetBasePath, currentLinks.dist)).then((result) => {
          if (result) {
            cliTools.info(`Copy static assets - end\r\n   Finished after ${new Date().getTime() - timeStarted}ms`)
          } else {
            cliTools.warn(result)
          }
        })
      })
    })
  }
}

module.exports = build
