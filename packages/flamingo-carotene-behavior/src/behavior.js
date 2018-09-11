/**
 *
 */
class Behavior {

  /**
   * @param listOfBehaviourClasses
   *
   * Webpack Globbing: import behaviorModules from '*.behavior.js'
   * behaviourClasses is an array, which holds esModules and a "default" class of behaviors in it
   * 0: default: named function
   * 1: default: named function
   * ...
   *
   * OR
   *
   * Babel Globbing: import * as behaviorModules from '*.behavior.js'
   * Object of Classes - result of babel globbing
   * {
   *   anyName: named function
   *   anotherName: named function
   *   ...
   * }
   */
  constructor(behaviourClasses) {
    /**
     * List of all registered behaviors
     * @type {{}}
     */
    this.behaviors = {}

    /**
     * Internal Flag, which outputs console logs of behavior functionality
     * @type {boolean}
     */
    this.debug = false

    for (let behaviorClassObjectIndex in behaviourClasses) {
      const behaviorClassObject = behaviourClasses[behaviorClassObjectIndex]
      let behaviorClass = null

      // Support for globbing: import behaviorModules from '...'
      if (behaviorClassObject.hasOwnProperty('__esModule') && behaviorClassObject.__esModule === true) {
        if (behaviorClassObject.hasOwnProperty('default')) {
          behaviorClass = behaviorClassObject.default
        }
      }
      else {
        // Support for globbing: import * as behaviorModules from '...'
        behaviorClass = behaviorClassObject
      }

      // if class has got a name
      if (behaviorClass.hasOwnProperty('name')) {
        const className = this._sanitizeName(behaviorClass.name)
        this.behaviors[className] = behaviorClass
      }
    }
    if (this.debug) {
      console.info(`Registered behaviors:`, this.behaviors)
    }
  }

  /**
   * Attachs a Behavior to given domElement (and all children)
   * @param domElement|null
   */
  attachBehaviors(domElement) {
    domElement = domElement || document
    const allElements = domElement.querySelectorAll('[data-behavior]')

    for (let behaviorElement of allElements) {
      this._attachBehaviorToDom(behaviorElement)
    }
  }

  /**
   * Detach all Behaviors to given domElement (and all children)
   * @param domElement
   */
  detachBehaviors(domElement) {
    domElement = domElement || document
    const allElements = domElement.querySelectorAll('[data-behavior]')
    for (let behaviorElement of allElements) {
      this._detachBehaviorsToDom(behaviorElement)
    }
  }

  /**
   * Returns a behavior instance from a dom Element
   * @param domElement
   * @returns {*}
   */
  getBehaviorFromElement(domElement) {
    let instance = null

    if (domElement.hasOwnProperty('nodeType')) {
      if (this.debug) {
        console.error(`Behavior: attachBehaviorToElement: No valid domElement given`, domElement)
      }
    }

    if (domElement.hasOwnProperty('behaviorInstance')) {
      instance = domElement.behaviorInstance
    }

    return instance
  }

  /**
   * Attachs a behavior to a given dom element
   * @param domElement
   */
  _attachBehaviorToDom(domElement) {
    const instance = this.getBehaviorFromElement(domElement)
    if (instance) {
      if (this.debug) {
        console.error('Behavior: attachBehaviorToElement: Element already initialized', instance)
      }
      return
    }

    const behaviorName = this._sanitizeName(domElement.dataset.behavior)

    if (!this.behaviors.hasOwnProperty(behaviorName)) {
      if (this.debug) {
        console.error(`Behavior: attachBehaviorToElement: Behavior "${behaviorName}" should be attached, but not registered. Check your spelling.`)
      }
      return
    }

    const behaviorClass = this.behaviors[behaviorName]
    if (this.debug) {
      console.info(`Behavior: attachBehaviorToElement: Initialize behavior "${behaviorName}" on domElement`, domElement)
    }

    domElement.behaviorInstance = {
      name: behaviorName,
      behavior: new behaviorClass(domElement)
    }
  }

  /**
   * Detach a behavior from a given dom element
   * @param domElement
   */
  _detachBehaviorsToDom(domElement) {
    const instance = this.getBehaviorFromElement(domElement)
    if (!instance) {
      if (this.debug) {
        console.error(`Behavior: detachBehaviors: Cant detach element, there is no behavior present.`, instance)
      }
      return
    }

    const behaviorName = this._sanitizeName(instance.name)
    if (this.debug) {
      console.info(`Behavior: detachBehaviors: Destroy behavior "${behaviorName}" on domElement`, domElement)
    }

    let destroyed = false

    // check if there is a destroy method
    if (typeof instance.behavior.destroy === 'function') {
      instance.behavior.destroy()
      destroyed = true
    }

    // check if there is a dispose method
    if (typeof instance.behavior.dispose === 'function') {
      instance.behavior.dispose()
      destroyed = true
    }

    if (!destroyed) {
      if (this.debug) {
        console.error(`Behavior: detachBehaviors: Cannot call destroy/dispose on "${behaviorName}" - methods not found.`, domElement)
      }
    }

    domElement.behaviorInstance = null
  }

  /**
   * Sanatizing Name for Behavior ClassNames and Data Attributes
   * @param {string} behaviorName
   * @returns {string}
   */
  _sanitizeName(behaviorName) {
    return behaviorName.toLowerCase()
  }

  /**
   * Enables Debug Mode
   * @param state {boolean}
   */
  setDebug(state) {
    this.debug = state
  }

}

module.exports = Behavior
