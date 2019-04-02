const path = require('path')

const carotenePath = path.resolve(__dirname)
const projectPath = path.resolve(process.cwd())

module.exports = {
  paths: {
    carotene: carotenePath,
    project: projectPath,
    src: path.join(projectPath, 'src'),
    dist: path.join(projectPath, 'dist')
  }
}
