/**
 * Behaviour to toggle accordion state on click
 */
export default class Test3 {

  constructor (element) {
    this.refs = {}
    this.refs.element = element
    element.innerHTML = "Text changed by Behavior (Test3)"
  }

  destroy () {
    this.refs = null
  }
}
