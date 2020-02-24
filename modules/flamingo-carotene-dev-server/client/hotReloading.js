export default class HotReloading {
  constructor () {
    this.elements = []
    this.loadedElements = 0
  }

  selectElements (tagName, requiredAttributes) {
    this.elements = []
    const allNodes = Array.from(document.getElementsByTagName(tagName))
    allNodes.forEach(function (element) {
      let elementMatches = true
      requiredAttributes.forEach(function (requiredAttribute) {
        if (!element.hasAttribute(requiredAttribute.name)) {
          elementMatches = false
        } else {
          if (element.getAttribute(requiredAttribute.name) !== requiredAttribute.value) {
            elementMatches = false
          }
        }
      })
      if (elementMatches) {
        this.elements.push(element)
      }
    }.bind(this))
  }

  removeElement (elementToRemove) {
    this.elements = this.elements.filter(function (element) {
      return element !== elementToRemove
    })
  }

  addElement (element) {
    this.elements.push(element)
  }

  makeReloadUrl (url) {
    const search = url.match(/hotReload=([0-9]+)$/)
    if (search) {
      url = url.replace(search[0], 'hotReload=' + (parseInt(search[1], 10) + 1))
    } else {
      if (url.indexOf('?') === -1) {
        url += '?'
      } else {
        url += '&'
      }
      url += 'hotReload=1'
    }
    return url
  }

  reloadResources (hrefAttribute, elementLoader, onFinish) {
    this.loadedElements = 0

    this.elements.forEach(function (element) {
      // create a NEW element and attach this after the original element
      const newElement = element.cloneNode(true)
      newElement.setAttribute(hrefAttribute, this.makeReloadUrl(element.getAttribute(hrefAttribute)))

      elementLoader.call(this, newElement, element, function () {
        this.removeElement(element)
        element.remove()
        this.addElement(newElement)
      }.bind(this), onFinish)
    }.bind(this))
  }

  elementLoaderJS (newElement, oldElement, onLoad, onFinishAll) {
    // TODO
    oldElement.parentNode.insertBefore(newElement, oldElement.nextSibling)
  }

  elementLoaderCSS (newElement, oldElement, onLoad, onFinishAll) {
    oldElement.parentNode.insertBefore(newElement, oldElement.nextSibling)

    let timeoutId = null
    let intervalId = null

    const loadEvent = function () {
      clearInterval(intervalId)
      clearTimeout(timeoutId)

      if (typeof onLoad === 'function') {
        onLoad()
      }

      this.loadedElements = this.loadedElements + 1

      if (this.loadedElements >= this.elements.length) {
        if (typeof onFinishAll === 'function') {
          onFinishAll()
        }
      }
    }.bind(this)

    intervalId = setInterval(function () {
      let sheet = 'styleSheet'
      let cssRules = 'rules'
      if ('sheet' in newElement) {
        sheet = 'sheet'
        cssRules = 'cssRules'
      }
      try {
        if (newElement[sheet] && newElement[sheet][cssRules].length) {
          loadEvent()
        }
      } catch (e) { } finally { }
    }, 100)

    timeoutId = setTimeout(function () {
      loadEvent()
    }, 15000)
  }
}


