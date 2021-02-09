import { createStore } from 'redux'
import { get } from 'object-path'
import watch from 'redux-watch'
import fastDeepEqual from 'fast-deep-equal'
import { wrap } from 'object-path-immutable'

/**
 * Generic reducer with the ability to set values in the state tree
 * @param state {Object} The current state object
 * @param action
 * @param action.type {String} Generic action type to set value. 'applicationStore.SET' ist the only available action type.
 * @param action.path {String} Path to the part of the state object that should be changed
 * @param action.value {Object} Value of the change
 * @return {Object} The new state object
 */
const rootReducer = (state = {}, action) => {
  if (action.type.startsWith('SET:') && action.path !== undefined) {
    return wrap(state).set(action.path, action.value).value()
  }
  return state
}

/**
 * Application state manager. Can store application wide state information and publish changes.
 */
class State {
  constructor () {
    this.store = null
  }

  /**
   * Initialize application state with js-object. To be called only once before usage of state instance.
   * @param {Object} initialState Object containing the initial application state
   * @return {void}
   */
  init (initialState) {
    if (!this.store) {
      this.store = createStore(rootReducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
    } else {
      throw new Error('State: Store is already initialized')
    }
  }

  /**
   * Subscribe to changes in specific parts of the store.
   * @param {String} path String in object notation to store part of interest
   * @param {Function} callback Callback function for store changes
   * @param {Object} options Options object
   * @param {Boolean} options.noCompare Will not compare new and old state before triggering listeners
   * @return {Function} Function which can be used to unsubscribe callback
   */
  watch (path, callback, options = {}) {
    // check if path param is used as callback without specific path (watch whole store)
    const callbackFunc = typeof path === 'function' ? path : callback
    const pathStr = typeof path === 'string' ? path : ''

    const opts = Object.assign({
      noCompare: false
    }, options)

    // using falsy compare function result triggers listener regardless if state value has actually changed
    const compareFn = opts.noCompare ? _ => false : fastDeepEqual

    // create watcher and subscribe to store
    const watchFunc = watch(this.store.getState, pathStr, compareFn)
    return this.store.subscribe(watchFunc(callbackFunc))
  }

  /**
   * Get state value by opject path string
   * @param {String} path String in object notation to store value or subtree
   * @return {Object} Value of given object path or undefined
   */
  get (path = '') {
    return get(this.store.getState(), path)
  }

  /**
   * Set state value of object property defined by object path string
   * @param {String} path String in object notation to store value
   * @param {Object} value Value that should be set to specified path
   * @return {void}
   */
  set (path, value) {
    this.store.dispatch({ type: 'SET: ' + path, path, value })
  }
}

// Export singleton instance
export default new State()
