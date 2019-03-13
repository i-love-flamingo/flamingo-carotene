const { spawn } = require('child_process')

class Spawner {

  constructor () {
    this.core = require('./core')
    this.cliTools = this.core.getCliTools()
    const packageJson = this.core.getConfigObject().getProjectPackageJson()

    this.usedPackageManager = Object.keys(packageJson.engines)[0];
    if (!this.usedPackageManager) {
      this.usedPackageManager = 'npm'
    }
  }

  spawnJobNpx (parameters) {
    let cmd = ''
    switch(this.usedPackageManager) {
      case 'npm':
        cmd = 'npx'
        break;
      case 'yarn':
        cmd = 'yarn'
        break;
    }
    return this.spawnJob(cmd, parameters)
  }


  spawnJob (cmd, parameters) {
    if (process.platform === 'win32') {
      cmd+= '.cmd'
    }

    const spawnEnv = process.env
    spawnEnv.FORCE_COLOR = true

    this.cliTools.info(`Spawning new process: "${cmd} ${parameters.join(' ')}"`, true)
    return spawn(cmd, parameters, {env: spawnEnv});
  }

}

module.exports = new Spawner()
