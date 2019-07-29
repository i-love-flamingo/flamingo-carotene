
class CommandDictionary {
  commands = []
  options = []

  constructor () {
    this.core = require('./core')
    this.cliTools = this.core.getCliTools()
    this.setCommands()
    this.setOptions()

    this.cliTools.log(this.printDictionary(), false)
  }

  setCommands () {
    const modules = this.core.getModules()

    for (const module of modules) {
      const listeners = module.getListeners()
      console.group(listeners, 'commands')
      for (const listener of listeners) {
        if (listener.command && listener.description) {
          const {command, description} = (listener)
          this.addCommand({command, description})
        }
      }
    }
  }

  setOptions () {
    const options = this.cliTools.getOptions()

    for (const option of options) {
      if (option.command && option.description) {
        const {command, description} = (option)
        this.addOptions({command, description})
      }
    }
  }

  addCommand (command) {
    this.commands.push(command)
  }

  addOptions (option) {
    this.options.push(option)
  }

  getAllOptions () {
    return this.options
  }

  getAllCommands () {
    return this.commands
  }

  printDictionary () {
    const mergedArray = this.getAllCommands().concat(this.getAllOptions())
    return this.toString(mergedArray)
  }

  toString(array) {
    return array.map(object => `${object.command} \n ${object.description}`).join('\n')
  }
}

module.exports = new CommandDictionary()
