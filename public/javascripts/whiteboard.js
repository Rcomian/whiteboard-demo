function WhiteBoard(canvas, onLine) {
  // Drawing
  var ctx = canvas[0].getContext('2d');

  // Publics
  this.randomColor = randomColor;
  this.clear = clear;
  this.drawLine = drawLine;

  // Main Interface
  function randomColor() {
    var col = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ];

    col[Math.floor(Math.random() * 3)] = 0;

    return col;
  };

  function clear() {
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(1, 1, canvas.width()-2, canvas.height()-2);
  };

  function drawLine(points, color) {
    if (points && points.length) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(' + color.join(',') + ')';
      ctx.moveTo(points[0].x, points[0].y);
      var i;
      for (i = 1; i < points.length; i += 1) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
  }

  // Line management
  var mouseloc = null;
  var points = null;

  function coordsFromEvent(e) {
  return { x: e.offsetX || (e.pageX - canvas.position().left), 
           y: e.offsetY || (e.pageY - canvas.position().top)};
  }

  function beginLine(pos) {
    mouseloc = pos;
    points = [];
    points.push(pos);
  }

  function endline() {
    if (mouseloc && points) {
      onLine(points);
      mouseloc = null;
      points = null;
    }
  }

  function midLine(pos) {
    if (mouseloc && points && points.length < 1000) {
      drawLine([mouseloc, pos], [196, 196, 196]);

      mouseloc = pos;
      points.push(pos);
    }
  }

  // Mouse events
  canvas.on('mousedown', function (e) {
    if (e.which === 1) {
      beginLine(coordsFromEvent(e));
    }
  });

  canvas.on('mousemove', function (e) {
    midLine(coordsFromEvent(e));
  });

  canvas.on('mouseup', endline);
  canvas.on('mouseout', endline);
  canvas.on('mouseleave', endline);

  canvas.on('touchstart', function(e) {
    e.preventDefault();
    beginLine(coordsFromEvent(e.originalEvent.touches[0]));
  });

  canvas.on('touchend', endline);
  canvas.on('touchcancel', endline);
  canvas.on('touchleave', endline);

  canvas.on('touchmove', function(e) {
    e.preventDefault();
    midLine(coordsFromEvent(e.originalEvent.touches[0]));
  });
}