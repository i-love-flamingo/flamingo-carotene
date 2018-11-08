const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const glob = require('glob')

const pugLint = (core) => {
    const cliTools = core.getCliTools()
    const config = core.getConfig()

    // trying to find sass lint in project folder..
    let configFile = path.join(config.paths.project, '.pug-lintrc.json')

    // if not exists, take standard one
    if (!fs.existsSync(configFile)) {
        configFile = path.join(config.paths.pugLint, '.pug-lintrc.json')
    }

    const files = []
    glob.sync(`${config.paths.src}/**/*.pug`).forEach((file) => {
        files.push(path.resolve(file))
    })

    const cmd = 'pug-lint'
    const parameters = ['--config', configFile].concat(files)
    cliTools.info('PugLint - start')

    const spawnEnv = process.env
    spawnEnv.FORCE_COLOR = true

    const childProcess = spawn(
        cmd,
        parameters,
        {
            env: spawnEnv
        }
    )

    const results = []
    const errors = []

    childProcess.stdout.on('data', function (data) {
        results.push(data)
    })

    childProcess.stderr.on('data', function (data) {
        const errorPrefix = `${config.paths.project}/`
        let lines = data.toString().split("\n").map((line) => {
            if (line.includes(errorPrefix)) {
                return `⚠️   ${line.split(errorPrefix).join('')}`
            }
            return line
        })
        errors.push(lines.join("\n"))
    })

    childProcess.on('exit', (code) => {
        const output = ['PugLint - end'].concat(results, errors).join('\n').trim()

        if (code !== 0) {
            cliTools.warn(output)
        } else {
            cliTools.info(output)
        }

        if (config.pugLint.breakOnError && errors.length > 0) {
            core.reportError(`PugLint report errors.`)
        }
    })
}

module.exports = pugLint
