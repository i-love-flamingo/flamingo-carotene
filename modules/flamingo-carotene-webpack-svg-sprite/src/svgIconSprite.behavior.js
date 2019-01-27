import fetch from 'unfetch'

export default class SvgIconSprite {
    refs = {}

    /**
     * constructor
     * @param element
     */
    constructor (element) {
      this.refs.element = element
      const url = element.dataset.spriteUrl
      this.fetch(url)
    }

    /**
     * Fetch sprite url
     * @param url
     */
    fetch (url) {
      fetch(url).then( r => r.text() ).then(this.success.bind(this))
    }

    /**
     * dispose
     */
    dispose () {
      this.refs = null
    }

    /**
     * success callback
     * @param data
     */
    success (data) {
      this.refs.element.innerHTML = data
    }
}
