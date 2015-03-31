var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;
http.listen(port);

app.use(function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function() {
    next();
  });
});

app.post('/logs', function (req, res) {
  res.send('Got a POST request');

//245 <158>1 2015-03-31T01:36:12.860323+00:00 host heroku router - at=info method=GET path="/login" host=www.data-snippet.io request_id=3ebc158c-4bdd-4325-a279-1c85ef6d7459 fwd="140.168.78.24" dyno=web.1 connect=0ms service=16ms status=200 bytes=2508

  lines = req.rawBody.match(/[^\r\n]+/g);
  lines.forEach(function(logLine) {
    if(logLine.match(/host heroku router/)) {
      message = {};
      keyValuePart = logLine.split(' - ')[1];
      things = keyValuePart.split(' ');
      things.forEach(function(thing){
        kv = thing.split('=');
        message[kv[0]] = kv[1];
        message.service = parseInt(message.service);
        message.connect = parseInt(message.connect);
        message.status  = parseInt(message.status);
        message.bytes  = parseInt(message.bytes);
      });
      io.emit('request', message);
    }
  });
});

io.on('connection', function(socket){
  console.log("Got connection!");
});