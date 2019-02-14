const io = require('socket.io-client')
const sockeUri = window.location.protocol + '//' + window.location.hostname + ':3000'
const socket = io(sockeUri)

socket.on('connect', function onConnect () {
  console.info('Connected socket with id: ' + socket.id)
})

socket.on('built', function () { window.location.reload() })
