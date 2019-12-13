const io = require('socket.io-client')
const sockeUri = window.location.protocol + '//' + window.location.hostname + ':3000'
const socket = io(sockeUri)

const messagePrefix = 'Flamingo Carotene DevServer - '

const getElements = function (tagName, requiredAttributes) {
  const allNodes = Array.from(document.getElementsByTagName(tagName));
  const foundNodes = []
  allNodes.forEach(function (element) {
    let elementMatches = true
    for (const [raKey, raValue] of requiredAttributes) {
      if (!element.hasAttribute(raKey)) {
        elementMatches = false
      } else {
        if (element.getAttribute(raKey) !== raValue) {
          elementMatches = false
        }
      }
    }
    if (elementMatches) {
      foundNodes.push(element)
    }
  })
  return foundNodes
}

const reloadResource = function (elements, hrefAttribute) {
  elements.forEach(function (element) {
  if (elementMatches) {
      console.log(messagePrefix + 'Found element', element)
      let url = element.getAttribute(hrefAttribute)
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
      console.log(messagePrefix + ' |- reloading', url)
      element.setAttribute(hrefAttribute, url)
    }
  })
}

socket.on('connect', function onConnect () {
  console.info(messagePrefix + 'Connected socket with id: ' + socket.id)
})

socket.on('built', function () {
  console.log(messagePrefix + 'Reloading Page...')
  window.location.reload()
})

socket.on('reloadCSS', function () {
  console.log(messagePrefix + 'Hot-Reload CSS')
  reloadResource(getElements('link', {'rel': 'stylesheet'}), 'href');
})

socket.on('reloadJS', function () {
  /*
  const scriptLinks = getElements('script', {'data-flamingo-carotene-reload': 'true'})
  if (scriptLinks.length > 0) {
    reloadResource
    console.log(messagePrefix + 'Reloading Page cause of JS changes...')
    var bodyElement = Array.from(document.getElementsByTagName('body'))[0]
    var event = new Event('flamingoCaroteneReloadJS');  // (*)
    bodyElement.dispatchEvent(event);
  }
  else {
   */
    console.log(messagePrefix + 'Not Hotreloading JS-Tag found! Reloading page...')
    window.location.reload()
  /*
  }
  */

})
