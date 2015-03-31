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
  console.log("This is the request body: " + req.rawBody);
});

fakeMessage = {date: '2015-03-26T09:48:54.276127+00:00',
                dyno: 'web.1',
                status: 200,
                client: '188.226.184.152',
                connect: 1,
                service: 21,
                bytes: 3159};

var f = function(value) {return Math.floor(value);};
var r = function(max) { return Math.random()*max; };
var s = function(value) {return Math.sqrt(value);};

sendFakeMessage = function(){
  fakeMessage.dyno = "web." + (f(r(4)) + 1);
  fakeMessage.status = r(1) > 0.1 ? 200 : 404;
  fakeMessage.connect = f(s(r(10)));
  fakeMessage.service =  f( s(r(50)) + r(1000) );
  fakeMessage.bytes = f(s((r() * 10000)) + 193 + r(10000));

  io.emit('request', fakeMessage);

  setTimeout(sendFakeMessage, Math.random()*200);
};

sendFakeMessage();

io.on('connection', function(socket){
  console.log("Got connection!");
});