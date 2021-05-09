var net = require('net')
var repl = require('repl')

module.exports = function(app, io, port) {
  const server = net.createServer(function (socket) {
    var r = repl.start({
      prompt: "node via TCP socket> ",
      input: socket,
      output: socket,
    })

    r.on('exit', function() {
      socket.end()
    })

    r.context.$ = {
      io: io.io,
      app: app,
      clear: io.clear
    }
  }).listen(port)

  return server
}
