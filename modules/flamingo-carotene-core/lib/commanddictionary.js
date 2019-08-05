
class CommandDictionary {
  commands = []
  options = []

  constructor () {
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
  printCommands () {
    const commandsString = this.toString(this.commands) || 'No commands are available'
    return `Commands: \n \t${commandsString}`
  }

  /**
   * Builds a string out of the list of options
   * @returns {string}
   */
  printOptions () {
    const optionsString = this.toString(this.options) || 'No options are available'
    return `Options: \n \t${optionsString}`
  }

  /**
   * Gets an array of commands or options, and return a string containing the command/option's name and it's concatenated descriptions
   * @param array {Array}
   * @returns {string | *}
   */
  toString(array) {
    return array.map(function (object) {
        if (Array.isArray(object.description)) {
          object.description.join(',')
        }

        return `${object.command} \t ${object.description}`
      }
    ).join('\n\t')
  }

}

module.exports = new CommandDictionary()
