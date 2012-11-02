
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , socketio = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

var server = http.createServer(app);

var io = socketio.listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var history = [];

io.sockets.on('connection', function(socket) {
  function emitHistory(points) {
    if (points && points.length) {
      socket.emit('draw', points.shift());
      process.nextTick(function() {
        emitHistory(points);
      })
    }
  };

  socket.emit('clear', {});
  socket.emit('draw', {points: [{x: 10, y: 10}, {x: 100, y: 10}], color: [128, 128, 128]});

  emitHistory(history.slice(-history.length));

  socket.on('draw', function (data) {
    history.push(data);
    history = history.slice(-1000);
    io.sockets.emit('draw', data);
  });
});

var net = require('net');
var repl = require('repl');


net.createServer(function (socket) {
  var r = repl.start({
    prompt: "node via TCP socket> ",
    input: socket,
    output: socket,
  });

  r.on('exit', function() {
    socket.end();
  });

  r.context.$ = {
    io: io,
    app: io,
    clear: function () {
        io.sockets.emit('clear', {});
        history = [];
      }
    };
}).listen(5001);