const mkdirp = require('mkdirp')
const path = require('path')
const shell = require('shelljs')

const messages = []
const errors = []
let timeStarted

/**
 * Logs out all messages and errors added to the respective arrays
 * @param cliTools
 */
const complete = (cliTools) => {
  messages.push(`Copy static assets - end\r\n    Finished after ${new Date().getTime() - timeStarted}ms`)

  messages.forEach(message => {
    cliTools.info(message)
  })

  if (errors.length > 0) {
    errors.push('Static assets couldn\'t process every given paths')
  }

  errors.forEach(error => {
    cliTools.warn(error)
  })
}

/**
 * Tries to copy recursively all files from source path to a destination path
 * @param srcPath
 * @param destPath
 * @returns {*}
 */
const copyFromSrcToDest = (srcPath, destPath) => {
  try {
    mkdirp(path.dirname(destPath), () => {
      shell.cp('-r', srcPath, destPath)
    })
  } catch (e) {
    return e
  }
}

/**
 * Builds all source and destination paths, calls a copy function and collects messages and errors. Returns total number of paths processed
 * @param staticAssetCfg
 */
const processPaths = function (staticAssetCfg) {
  const srcBasePath = staticAssetCfg.basePaths.src
  const destBasePath = staticAssetCfg.basePaths.dest
  const assetPaths = staticAssetCfg.assetPaths

  // Loops through each item to copy them
  assetPaths.forEach((currentPaths) => {
    const currentSrcPath = path.join(srcBasePath, currentPaths.src)
    const currentDestPath = path.join(destBasePath, currentPaths.dest)

    // Copies source to destination path
    const error = copyFromSrcToDest(currentSrcPath, currentDestPath)
    if (error) {
      errors.push(error)
    }
  })
}

/**
 * Main function that runs on build
 * @param core
 */
const build = (core) => {
  const config = core.getConfig()
  const cliTools = core.getCliTools()

  if (!config.staticAsset.assetPaths) {
    cliTools.warn('Static asset executed but no config set')
    return
  }

  // Creates base directory if it doesn't exist
  mkdirp(config.staticAsset.basePaths.dest, function (err) {
    if (err) {
      errors.push(err)
    }

    cliTools.info('Copy static assets - start')
    timeStarted = new Date().getTime()
    // Processes all paths given to copy files
    processPaths(config.staticAsset)

    complete(cliTools)
  })
}

module.exports = build
