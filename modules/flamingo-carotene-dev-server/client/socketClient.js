const io = require('socket.io-client')
const sockeUri = window.location.protocol + '//' + window.location.hostname + ':3000'
const socket = io(sockeUri)
const CaroteneDisplay = require('./caroteneDisplay.js')
const HotReloading = require('./hotReloading.js')

let caroteneDisplay = null

socket.on('connect', function onConnect () {
  // Do nothing here - we know the socket.id from here
})

socket.on('connected', function onConnected (devServerConfig) {
  if (devServerConfig.hasOwnProperty('useCaroteneDisplay')) {
    if (devServerConfig.useCaroteneDisplay) {
      caroteneDisplay = new CaroteneDisplay()
    }
  }

  if (caroteneDisplay) {
    caroteneDisplay.setMessage('Connected to Flamingo Carotene Dev Server')
    caroteneDisplay.showMessage(2000)
  }
})

socket.on('report', function onReport (reportData) {
  if (caroteneDisplay) {
    caroteneDisplay.setReport(reportData)
    if (reportData.openJobs.length > 0) {
      caroteneDisplay.setFullscreen(false)
    }
    if (!caroteneDisplay.isFullscreen()) {
      caroteneDisplay.showMessage(reportData.openJobs.length ? 0 : 2000)
    }
  }
})

socket.on('buildOutput', function onReport (reportData) {
  if (caroteneDisplay) {
    caroteneDisplay.setMessage(reportData)
    caroteneDisplay.setFullscreen(true, false)
  }
})

socket.on('built', function () {
  if (caroteneDisplay) {
    caroteneDisplay.setMessage('Reloading Page...^')
    caroteneDisplay.setFullscreen(true)
  }
  window.location.reload()
})

socket.on('reloadCSS', function () {
  if (caroteneDisplay) {
    caroteneDisplay.setMessage('Hot-Reload CSS')
    caroteneDisplay.setFullscreen(true)
  }
  const hotReloading = new HotReloading()
  hotReloading.selectElements('link', [{ 'name': 'rel', 'value': 'stylesheet' }])
  hotReloading.reloadResources('href', hotReloading.elementLoaderCSS, function () {
    if (caroteneDisplay) {
      caroteneDisplay.setFullscreen(false)
      caroteneDisplay.setMessage('Waiting...')
    }
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
  if (caroteneDisplay) {
    caroteneDisplay.setMessage('No Hotreloading JS-Tag found! Reloading page...')
    caroteneDisplay.setFullscreen(true)
  }
  window.location.reload()
  /*
  }
  */
})
