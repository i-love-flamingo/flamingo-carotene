import objectPathImmutable from 'object-path-immutable'

/**
 * Generic reducer with the ability to set values in the state tree
 * @param state {Object} The current state object
 * @param action.type {String} Generic action type to set value. 'applicationStore.SET' ist the only available action type.
 * @param action.path {String} Path to the part of the state object that should be changed
 * @param action.value {Object} Value of the change
 * @return {Object} The new state object
 */
export function rootReducer (state = {}, action) {
  if (action.type.startsWith('SET:') && action.path !== undefined) {
    return objectPathImmutable.set(state, action.path, action.value)
  }

  return state
}
