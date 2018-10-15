var io = require('socket.io-client')
var socket = io('http://localhost:3000')

socket.on('connect', function onConnect () {
  console.info('Connected socket with id: ' + socket.id)
})

socket.on('built', function () { window.location.reload() })
