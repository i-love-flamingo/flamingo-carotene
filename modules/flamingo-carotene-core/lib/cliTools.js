const util = require('util')
const chalk = require('chalk')

class CliTools {
  constructor () {
    this.args = process.argv.slice(2)
    this.verbose = this.args.indexOf('-v') > -1

    this.chalk = chalk
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

  /**
   * Cli logger
   * @param message
   * @param type      Type of message: default, info, warn
   * @param verbose   Is verbose message - only log when verbose option is set. Defaults to false
   */
  write (message, type, verbose) {
    type = type || 'default'
    verbose = !!verbose

    if (this.verbose || this.verbose === verbose) {
      switch (type) {
        case 'info':
          process.stdout.write(`\n${verbose ? 'ℹ️ ' : '🥕'}  ${message}\n`)
          break
        case 'warn':
          process.stdout.write(`\n⚠️   ${message}\n`)
          break
        case 'default':
        default:
          process.stdout.write(`${message}\n`)
      }
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
