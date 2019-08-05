class Dispatcher {

  constructor () {
    this.core = require('./core')
  }

  dispatchCommand (command) {
    const cliTools = this.core.getCliTools()

    cliTools.info(`Dispatch command: ${command}`)

    const modules = this.core.getModules()
    const listenerQue = []

    for (const module of modules) {
      const listeners = module.getListeners()

      for (const listener of listeners) {
        if (listener.command !== command) {
          continue
        }

        if (!Number.isSafeInteger(listener.priority)) {
          listener.priority = 0
        }

        listener.module = module
        listenerQue.push(listener)
      }
    }

    listenerQue.sort((l1, l2) => {
      return l2.priority - l1.priority
    })

    cliTools.info(`Listeners for command: ${command}\r\n${cliTools.inspect(listenerQue)}`, true)

    const initializeWarnings = []

    for (const listener of listenerQue) {
      const listenerLoadStartTime = new Date().getTime()
      listener.handler(this.core)
      const listenerLoadTime = new Date().getTime() - listenerLoadStartTime

      if (command === 'config' && listenerLoadTime > 100) {
        initializeWarnings.push(`${listener.module.name}: ${listenerLoadTime}ms`)
      }
    }

    if (initializeWarnings.length > 0) {
      cliTools.warn([`Warning: The following Modules takes too long at config-time:\n\r`] + initializeWarnings.join('\n\r'), true)
    }
  }

  commandExists (command) {
    const modules = this.core.getModules()

    for (const module of modules) {
      const listeners = module.getListeners()
      const hasCommand = listeners.some(listener => listener.command === command)

      if (hasCommand) {
        return true
      }
    }
    return false
  }
}

module.exports = Dispatcher
