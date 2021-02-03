const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

const errors = []

/**
 * Logs out all messages and errors added to the respective arrays
 * @param core
 */
const logErrors = (core) => {
  if (errors.length === 0) {
    return
  }

  errors.forEach(error => core.getCliTools().error(error))
  core.reportError('Copying assets failed')
}

/**
 * Tries to copy recursively all files from source path to a destination path
 * @param srcPath
 * @param destPath
 */
const copyFromSrcToDest = (srcPath, destPath) => {
  try {
    if (fs.lstatSync(srcPath).isDirectory()) {
      srcPath = path.join(srcPath, '*')
    }
    mkdirp.sync(destPath)
  } catch (err) {
    errors.push(`There were problems while creating ${destPath} - ${err.message}`)
    return
  }

  const cpResult = shell.cp('-R', srcPath, destPath)
  if (cpResult.code !== 0) {
    errors.push(`Copying assets failed - ${cpResult.stderr}`)
  }
}

/**
 * Builds all source and destination paths, calls a copy function and collects messages and errors. Returns total number of paths processed
 * @param staticAssetCfg
 */
const processPaths = staticAssetCfg => {
  const srcBasePath = staticAssetCfg.basePaths.src
  const destBasePath = staticAssetCfg.basePaths.dest
  const assetPaths = staticAssetCfg.assetPaths

  // Loops through each item to copy them
  assetPaths.forEach(currentPaths => {
    const currentSrcPath = path.join(srcBasePath, currentPaths.src)
    const currentDestPath = path.join(destBasePath, currentPaths.dest)

    // Copies source to destination path
    copyFromSrcToDest(currentSrcPath, currentDestPath)
  })
}

/**
 * Main function that runs on build
 * @param core
 */
const build = (core) => {
  const config = core.getConfig()
  const jobManager = core.getJobmanager()

  if (!config.staticAsset.assetPaths) {
    errors.push('Static asset executed but no config set')
    logErrors(core)
    return
  }

  jobManager.addJob('staticAssets', 'Copy static assets', 'staticAsset')
  jobManager.setSubJobTotalCount('staticAssets', 1)

  try {
    mkdirp.sync(config.staticAsset.basePaths.dest)
  } catch (err) {
    errors.push(`There were problems while creating ${config.staticAsset.basePaths.dest} - ${err.message}`)
    logErrors(core)
    jobManager.finishJob('staticAssets')
    return
  }

  processPaths(config.staticAsset)
  logErrors(core)
  jobManager.reportFinishJob('staticAssets')
  jobManager.finishJob('staticAssets')
}

module.exports = build
