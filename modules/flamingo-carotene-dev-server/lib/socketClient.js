const io = require('socket.io-client')
const sockeUri = window.location.protocol + '//' + window.location.hostname + ':3000'
const socket = io(sockeUri)
const messagePrefix = 'Flamingo Carotene DevServer - '

socket.on('connect', function onConnect () {
  console.info(messagePrefix + 'Connected socket with id: ' + socket.id)
})

socket.on('built', function () {
  console.log(messagePrefix + 'Reloading Page...')
  window.location.reload()
})

socket.on('reloadCSS', function () {
  const allCSSNodes = Array.from(document.getElementsByTagName('link'));
  console.log(messagePrefix + 'Hot-Reload CSS')
  allCSSNodes.forEach(function (element) {
    if (element.getAttribute('rel') === 'stylesheet') {
      let url = element.getAttribute('href')
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
      element.setAttribute('href', url)
    }
  })
})

socket.on('reloadJS', function () {
  console.log(messagePrefix + 'Reloading Page cause of JS changes...')
  window.location.reload()
})
