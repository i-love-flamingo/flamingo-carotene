/**
 * Behaviour to toggle accordion state on click
 */
export default class Test1 {

  constructor (element) {
    this.refs = {}
    this.refs.element = element
    this.oldContent = element.textContent;
    element.innerHTML = "Text changed by Behavior (Test)"
  }

  dispose () {
    this.refs.element.innerHTML = this.oldContent;
    this.refs = null
  }
}
