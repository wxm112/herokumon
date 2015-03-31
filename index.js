var http = require('http').createServer(handler);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;
http.listen(port);

function handler (req, res) {
  res.writeHead(404);
  res.end("Not Found");
}



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