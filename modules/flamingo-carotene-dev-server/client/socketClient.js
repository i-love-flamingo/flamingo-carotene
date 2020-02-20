const io = require('socket.io-client')
const sockeUri = window.location.protocol + '//' + window.location.hostname + ':3000'
const socket = io(sockeUri)
const CaroteneDisplay = require('./caroteneDisplay.js')
const HotReloading = require('./hotReloading.js')

const caroteneDisplay = new CaroteneDisplay()

socket.on('report', function onReport (reportData) {
  caroteneDisplay.setReport(reportData)
  caroteneDisplay.showMessage(reportData.openJobs.length ? 0 : 2000)
})

socket.on('connect', function onConnect () {
  caroteneDisplay.setMessage('Connected socket with id: ' + socket.id)
  caroteneDisplay.showMessage(2000)
})

socket.on('built', function () {
  caroteneDisplay.setMessage('Reloading Page...^')
  caroteneDisplay.setFullscreen(true)
  window.location.reload()
})

socket.on('reloadCSS', function () {
  caroteneDisplay.setMessage('Hot-Reload CSS')
  caroteneDisplay.setFullscreen(true)

  const hotReloading = new HotReloading()
  hotReloading.selectElements('link', [{ 'name': 'rel', 'value': 'stylesheet' }])
  hotReloading.reloadResources('href', hotReloading.elementLoaderCSS, function () {
    caroteneDisplay.setFullscreen(false)
    caroteneDisplay.setMessage('Waiting...')
  })
})

socket.on('reloadJS', function () {
  /*
  const scriptLinks = getElements('script', {'data-flamingo-carotene-reload': 'true'})
  if (scriptLinks.length > 0) {
    reloadResource
    console.log(messagePrefix + 'Reloading Page cause of JS changes...')
    var bodyElement = Array.from(document.getElementsByTagName('body'))[0]
    var event = new Event('flamingoCaroteneReloadJS')  // (*)
    bodyElement.dispatchEvent(event)
  }
  else {
   */
  caroteneDisplay.setMessage('No Hotreloading JS-Tag found! Reloading page...')
  caroteneDisplay.setFullscreen(true)
  window.location.reload()
  /*
  }
  */
})
