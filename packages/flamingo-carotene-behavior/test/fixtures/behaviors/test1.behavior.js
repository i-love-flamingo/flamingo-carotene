/**
 * Behaviour to toggle accordion state on click
 */
export default class Test1 {

  constructor (element) {
    this.refs = {}
    this.refs.element = element
    element.innerHTML = "Text changed by Behavior (Test)"
    console.log('TEST behaviour contructed', element)
  }

  destroy () {
    this.refs = null
  }
}
