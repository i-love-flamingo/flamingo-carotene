const util = require('util')
const chalk = require('chalk')
var emoji = require('node-emoji')

class CliTools {
  constructor () {
    this.args = process.argv.slice(2)
    this.verbose = this.isVerbose()

    this.chalk = chalk
    this.doBufferOut = false;
    this.buffer = ''
  }

  /**
   * Get the provided command
   * @returns {*}
   */
  getCommand () {
    return this.args[0]
  }

  /**
   * Get the provided options
   * @returns {*}
   */
  getOptions () {
    return this.args.slice(1)
  }

  isVerbose() {
    return this.args.indexOf('-v') > -1
  }

  isExperimental () {
    for (const option of this.getOptions()) {
      if (option === '--experimental') {
        return true;
      }
    }
    return false;
  }

  startBuffer () {
    this.doBufferOut = true
  }

  getBuffer () {
    this.doBufferOut = false
    return this.buffer
  }

  /**
   * Cli logger
   * @param message
   * @param type      Type of message: default, info, warn
   * @param verbose   Is verbose message - only log when verbose option is set. Defaults to false
   */
  write (message, type, verbose) {
    type = type || 'default'
    verbose = !!verbose

    let outMessage = ''

    const iconCarrot = emoji.get('carrot')
    const iconInfo = emoji.get('information_source')
    const iconWarn = emoji.get('warning')

    if (this.verbose || this.verbose === verbose) {
      switch (type) {
        case 'info':
          outMessage = `${verbose ? iconInfo : iconCarrot} ${message}\n`
          break
        case 'warn':
          outMessage = `${iconWarn} ${message}\n`
          break
        case 'default':
        default:
          outMessage = `  ${message}\n`
      }
    }


    if (this.doBufferOut) {
      this.buffer+= outMessage
    }
    else {
      process.stdout.write(outMessage)
    }
  }

  log (message, verbose) {
    this.write(message, 'default', verbose)
  }

  info (message, verbose) {
    this.write(message, 'info', verbose)
  }

  warn (message, verbose) {
    this.write(message, 'warn', verbose)
  }

  /**
   * Show how to use the cli
   */
  showUsage () {
    this.info(
      `Usage: flamingo-carotene {command} [option(s)]
    
    Commands:
        config
        build
    
    Options:
        -v        verbose output`)
  }

  inspect (json, options) {
    const mergedOptions = Object.assign({
      colors: true,
      compact: false,
      depth: 5
    }, options)

    return util.inspect(json, mergedOptions)
  }

  /**
   * Cli process exit handler
   */
  exit (code) {
    code = code || 0
    process.exit(code)
  }
}

module.exports = CliTools
