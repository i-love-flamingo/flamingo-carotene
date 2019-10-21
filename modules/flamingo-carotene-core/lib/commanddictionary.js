const CliTable = require('cli-table3');
var wrap = require('word-wrap');


class CommandDictionary {

  constructor () {
    this.commands = []
    this.options = []

    this.core = require('./core')
    this.cliTools = this.core.getCliTools()
    this.setCommands()
  }

  /**
   * Retrieves all commands from the modules' listeners
   */
  setCommands () {
    const modules = this.core.getModules()

    for (const module of modules) {
      const listeners = module.getListeners()
      listeners.sort(function(l1, l2) {
        if (!Number.isSafeInteger(l1.priority)) {
          l1.priority = 0
        }
        if (!Number.isSafeInteger(l2.priority)) {
          l2.priority = 0
        }

        return l2.priority - l1.priority
      })

      for (const listener of listeners) {
        if (listener.command && listener.description) {
          const {command, description} = (listener)
          this.addCommand(command, description)
        }
      }
    }
  }

  /**
   * Adds a command and/or appends descriptions to the commands list
   * @param command {String}
   * @param description {String}
   */
  addCommand (command, description) {
    const commandIndex = this.options.findIndex(function(option) {
      return option.command === command
    })

    if (commandIndex > -1) {
      this.commands[commandIndex].description.push(description)
      return
    }
    this.commands.push({'command': command, 'description': [description]})
  }

  /**
   * Adds an option and it's description to the options list
   * @param command {String}
   * @param description {String}
   */
  addOption (command, description) {
    const optionIndex = this.options.findIndex(function(option) {
      return option.command === command
    })
    if (optionIndex > -1) {
      this.options[optionIndex].description = description
      return
    }
    this.options.push({'command': command, 'description': description})
  }

  /**
   * Builds a string out of the list of commands
   * @returns {string}
   */
  prettyCommands () {
    return this.createCLITable(this.commands, 'Commands') || 'No commands are available\n'
  }

  /**
   * Builds a string out of the list of options
   * @returns {string}
   */
  prettyOptions () {
    return this.createCLITable(this.options, 'Options') || 'No options are available\n'
  }

  resolveDescription (data) {
    if (typeof data === 'function') {
      return data()
    }
    return data
  }

  /**
   * Gets an array of commands or options, and return a string containing the command/option's name and it's concatenated descriptions
   * @param array {Array}
   * @returns {string | *}
   */
  createCLITable(array, headline) {
    const collectedObjects = {}

    for (const item of array) {
      if (Array.isArray(item.description)) {
        const newDescArray = []
        for (const desc of item.description) {
          newDescArray.push(this.resolveDescription(desc))
        }
        item.description = newDescArray.join(',')
      } else {
        item.description = this.resolveDescription(item.description)
      }

      if (!collectedObjects.hasOwnProperty(item.command)) {
        collectedObjects[item.command] = []
      }
      collectedObjects[item.command].push(item.description)
    }

    var terminalSize = process.stdout.columns
    var maxWidth = terminalSize - 3
    var commandWidth = 26
    var descWidth = maxWidth - commandWidth
    var table = new CliTable({
      head: [headline, ''],
      style: {
        'padding-left': 0,
        'padding-right': 0,
        border: []
      },
      chars: {
        'top': '',
        'top-mid': '' ,
        'top-left': '' ,
        'top-right': '',
        'bottom': '',
        'bottom-mid': '',
        'bottom-left': '',
        'bottom-right': '',
        'left': '',
        'left-mid': '',
        'mid': '',
        'mid-mid': '',
        'right': '',
        'right-mid': '',
        'middle': ' '
      },
      colWidths:[commandWidth, descWidth]
    })
    for (const key in collectedObjects) {
      const desc = wrap(collectedObjects[key].join(', '), {width: descWidth, newline: '\n', trim: true, indent:''})
      table.push([key, desc])
    }
    return table.toString()+'\n\n'
  }


}

module.exports = new CommandDictionary()
