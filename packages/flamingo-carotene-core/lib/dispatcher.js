const core = require('./core')

const cliTools = core.getCliTools()

class Dispatcher {
  constructor (modules) {
    this.modules = modules
  }

  dispatchCommand (command) {
    cliTools.info(`Dispatch command: ${command}`)

    const listenerQue = []

    for (const module of this.modules) {
      const listeners = module.getListeners()

      for (const listener of listeners) {
        if (listener.command !== command) {
          continue
        }

        if (!Number.isSafeInteger(listener.priority)) {
          listener.priority = 0
        }

        listenerQue.push(listener)
      }
    }

    listenerQue.sort((l1, l2) => {
      return l2.priority - l1.priority
    })

    cliTools.info(`Listeners for command: ${command}\r\n${cliTools.inspect(listenerQue)}`, true)

    for (const listener of listenerQue) {
      listener.handler(core)
    }
  }
}

module.exports = Dispatcher
