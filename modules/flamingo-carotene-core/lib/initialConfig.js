const path = require('path')

const flamingoCarotenePath = path.resolve(__dirname)
const projectPath = path.resolve(process.cwd())

module.exports = {
  paths: {
    flamingoCarotene: flamingoCarotenePath,
    project: projectPath,
    src: path.join(projectPath, 'src'),
    dist: path.join(projectPath, 'dist')
  }
}
