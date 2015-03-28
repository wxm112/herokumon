var http = require('http').createServer(handler);
var io = require('socket.io')(http);

var port = process.env.PORT || 3000;
http.listen(port);

console.log("Listening on port " + port);

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

sendFakeMessage = function(){
  fakeMessage.dyno = "web." + Math.floor((Math.random() * 10) + 1);
  fakeMessage.status = Math.random() > 0.1 ? 200 : 404;
  fakeMessage.connect = Math.floor(Math.sqrt((Math.random() * 100)) + 1);
  fakeMessage.service = Math.floor((Math.random() * 100) + Math.sqrt((Math.random() * 10000)) + 1);
  fakeMessage.bytes = Math.floor(Math.sqrt((Math.random() * 10000)) + 193);

  io.emit('request', fakeMessage);

  setTimeout(sendFakeMessage, Math.random()*200);
};

sendFakeMessage();

io.on('connection', function (socket) {
  console.log("Got connection");
  socket.on('hello', function (data){
    console.log("The client say hello " + data);
  });
});
