
class Dispatcher {

  dispatchCommand (command) {
    const core = require('./core')
    const cliTools = core.getCliTools()

    cliTools.info(`Dispatch command: ${command}`)

    const modules = core.getModules()
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

        listener.caroteneModule = module;
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
      listener.handler(core)
      const listenerLoadTime = new Date().getTime() - listenerLoadStartTime

      if (command === 'config' && listenerLoadTime > 100) {
        initializeWarnings.push(`${listener.caroteneModule.caroteneModuleName}: ${listenerLoadTime}ms`)
      }
    }

    if (initializeWarnings.length > 0) {
      cliTools.warn([`Warning: The following Modules takes too long at config-time:\n\r`] + initializeWarnings.join('\n\r'));
    }

  }
}

module.exports = Dispatcher
