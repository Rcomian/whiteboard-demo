const { Server } = require('socket.io')

module.exports = function(server) {
  const io = new Server(server)

  let history = []

  io.on('connection', (socket) => {
    function emitHistory(points) {
      if (points && points.length) {
        socket.emit('draw', points.shift())
        process.nextTick(() => {
          emitHistory(points)
        })
      }
    }
  
    socket.emit('clear', {})
    socket.emit('draw', {points: [{x: 10, y: 10}, {x: 100, y: 10}], color: [128, 128, 128]})
  
    emitHistory(history.slice(-history.length))
  
    socket.on('draw', function (data) {
      history.push(data)
      history = history.slice(-1000)
      io.emit('draw', data)
    })
  })

  function clear() {
    io.emit('clear', {})
    history = []
  }

  return {io, clear}
}
