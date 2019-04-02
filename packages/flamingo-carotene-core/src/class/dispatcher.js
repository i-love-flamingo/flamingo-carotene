const cliTools = require('./cliTools')
const config = require('./config')

class Dispatcher {
  constructor (modules) {
    this.modules = modules
  }

  dispatchCommand (command) {
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
      return l1.priority - l2.priority
    })

    cliTools.info(`Listeners for command: ${command}\r\n${cliTools.inspect(listenerQue)}`, true)

    for (const listener of listenerQue) {
      listener.handler(config, cliTools)
    }
  }
}

module.exports = Dispatcher
