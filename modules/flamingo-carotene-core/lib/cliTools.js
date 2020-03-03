const util = require('util')
const chalk = require('chalk')
const emoji = require('node-emoji')
var readline = require('readline');

class CliTools {
  constructor () {
    const core = require('./core')
    this.dictionary = core.getDictionary()
    this.args = process.argv.slice(2)
    this.verbose = this.isVerbose()
    this.chalk = chalk
    this.doBufferOut = false
    this.buffer = []
    this.maxBufferEntries = 1000;
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

  getOptionValue (optionName) {
    let findOptionStr = `--${optionName}=`

    for (const option of this.getOptions()) {
      if (option.substr(0, findOptionStr.length) == findOptionStr)  {
        return option.substr(findOptionStr.length)
      }
    }

  }

  hasOption(possibleOptions) {
    if (!Array.isArray(possibleOptions)) {
      possibleOptions = [possibleOptions]
    }

    for (const searchOption of possibleOptions) {
      for (const option of this.getOptions()) {
        if (searchOption === option) {
          return true
        }
      }
    }
    return false
  }

  isVerbose() {
    return this.hasOption('--verbose') || this.hasOption('-v')
  }

  isExperimental () {
    return this.hasOption('--experimental')
  }

  startBuffer () {
    this.doBufferOut = true
  }

  /**
   * Stores a message with timestamp into a buffer
   *
   * @param message
   * @param type      Type of message: default, info, warn
   * @param verbose   Is verbose message - only log when verbose option is set. Defaults to false
   */
  addToBuffer(message, type, verbose) {
    this.buffer.push({
      time: new Date(),
      message: message,
      type: type,
      verbose: verbose
    });
    if (this.buffer.length > this.maxBufferEntries) {
      this.buffer = this.buffer.slice(this.maxBufferEntries)
    }
  }

  /**
   * Returns messages that are newer as given a given time
   * @param laterThan   Messages needs to be older than this time (optional)
   * @returns []object
   */
  getBuffer (laterThan) {
    const newBuffer = []
    for (const bufferLine of this.buffer) {
      if (!laterThan || bufferLine.time.getTime() > laterThan.getTime()) {
        newBuffer.push(bufferLine)
      }
    }
    return newBuffer
  }

  /**
   * Return messages that are newer as given a given time as a string
   * @param laterThan             Messages needs to be newer than this time (optional)
   * @param customFormatFunction  Format function. Default is this.formatMessage
   * @returns {string}
   */
  getBufferAsString (laterThan, customFormatFunction) {
    let bufferString = ''
    for (const bufferLine of this.getBuffer(laterThan)) {
      if (typeof(customFormatFunction) != 'function') {
        customFormatFunction = this.formatMessage
      }
      bufferString+= customFormatFunction(bufferLine.message, bufferLine.type, bufferLine.verbose)
    }
    return bufferString
  }

  stopBuffer() {
    this.doBufferOut = false
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
      this.addToBuffer(message, type, verbose)

      if (!this.doBufferOut) {
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(this.formatMessage(message, type, verbose))
      }
    }
  }

  /**
   * Formats a message for CLI output
   *
   * @param message
   * @param type      Type of message: default, info, warn
   * @param verbose   Is verbose message - only log when verbose option is set. Defaults to false
   * @returns {string}
   */
  formatMessage(message, type, verbose) {
    let outMessage = ''

    const iconCarrot = emoji.get('carrot')
    const iconInfo = emoji.get('information_source')
    const iconWarn = emoji.get('warning')
    const iconError = emoji.get('x')

    message = message + ''
    message = message.replace(/\n/g, '\n   ')

    switch (type) {
      case 'info':
        outMessage = `${verbose ? iconInfo : iconCarrot} ${message}\n`
        break
      case 'warn':
        outMessage = `${iconWarn} ${message}\n`
        break
      case 'error':
        outMessage = `${iconError} ${message}\n`
        break
      case 'default':
      default:
        outMessage = `  ${message}\n`
    }
    return outMessage
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

  error (message, verbose) {
    this.write(message, 'error', verbose)
  }

  /**
   * Show how to use the cli
   */
  showUsage () {
    this.info(`Usage: flamingo-carotene {command} [option(s)]`)
    this.dictionary.addOption('--verbose,  -v', 'Displays much more output.')
    this.dictionary.addOption('--experimental', 'Enables experimental flag to enable experimental features (if there are any)')

    process.stdout.write(this.dictionary.prettyCommands())
    process.stdout.write(this.dictionary.prettyOptions())
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
