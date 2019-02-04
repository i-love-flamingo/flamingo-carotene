const mkdirp = require('mkdirp')
const path = require('path')
const shell = require('shelljs')

const messages = []
const errors = []

/**
 * Logs out all messages and errors added to the respective arrays
 * @param cliTools
 */
const complete = (cliTools) => {
  messages.forEach(message => {
    cliTools.info(message)
  })

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
 * @param srcBasePath
 * @param destBasePath
 * @param allConfigPaths
 * @returns {number}
 */
const processPaths = function (srcBasePath, destBasePath, allConfigPaths) {
  let numberOfPathsProcessed = 0

  // Loops through each item to copy them
  allConfigPaths.forEach((currentPaths) => {
    const currentSrcPath = path.join(srcBasePath, currentPaths.src)
    const currentDestPath = path.join(destBasePath, currentPaths.dest)

    // Copies source to destination path
    const error = copyFromSrcToDest(currentSrcPath, currentDestPath)
    if (error) {
      errors.push(error)
    } else {
      messages.push(`finished copying, from ${currentSrcPath} to > ${currentDestPath}`)
      numberOfPathsProcessed++
    }
  })

  return numberOfPathsProcessed
}

/**
 * Main function that runs on build
 * @param core
 */
const build = (core) => {
  const config = core.getConfig()
  const cliTools = core.getCliTools()

  if (!config.staticAsset.configPaths) {
    cliTools.warn('Static asset executed but no config set')
    return
  }

  const assetSrcBasePath = config.staticAsset.basePaths.src
  const assetTargetBasePath = config.staticAsset.basePaths.dest

  // Creates base directory if it doesn't exist
  mkdirp(assetTargetBasePath, function (err) {
    if (err) {
      errors.push(err)
    }

    cliTools.info('Copy static assets - start')
    const timeStarted = new Date().getTime()

    // Processes all paths given to copy files
    const numberOfPathsProcessed = processPaths(assetSrcBasePath, assetTargetBasePath, config.staticAsset.configPaths)
    // If all paths have been processed, show success message. Or push error
    if (numberOfPathsProcessed === config.staticAsset.configPaths.length) {
      messages.push(`Copy static assets - end\r\n    Finished after ${new Date().getTime() - timeStarted}ms`)
    } else {
      errors.push('Static assets couldn\'t process every given paths')
    }

    complete(cliTools)
  })
}

module.exports = build
