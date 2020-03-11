export default class HotReloading {
  constructor () {
    this.elements = []
    this.loadedElements = 0
    this.securityWarningLogged = false
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

        if (element.remove) {
          element.remove()
        }
        else {
          // IE11
          element.parentNode.removeChild(element)
        }

        this.addElement(newElement)
      }.bind(this), onFinish)
    }.bind(this))
  }

  elementLoaderJS (newElement, oldElement, onLoad, onFinishAll) {
    // TODO
    oldElement.parentNode.insertBefore(newElement, oldElement.nextSibling)
  }

  elementLoaderCSS (newElement, oldElement, onLoad, onFinishAll) {
    this.securityWarningLogged = false

    let timeoutId = null
    let intervalId = null

    const loadEvent = _ => {
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
    }

    const checkCss = _ => {
      if (this._cssIsLoaded(newElement)) {
        loadEvent()
      } else {
        intervalId = setTimeout(checkCss, 100)
      }
    }

    checkCss()

    timeoutId = setTimeout(function () {
      loadEvent()
    }, 10000)

    oldElement.parentNode.insertBefore(newElement, oldElement.nextSibling)
  }

  _cssIsLoaded (newElement) {
    try {
      return newElement.styleSheet && newElement.styleSheet.rules.length || newElement.sheet && newElement.sheet.cssRules.length
    } catch (e) {
      if (e.name === 'SecurityError' && !this.securityWarningLogged) {
        console.warn('Your stylesheet is from a different domain. Hot reloading is limited.')
        this.securityWarningLogged = true
      }
      return false
    }
  }
}


