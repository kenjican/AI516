let WebSocketServer = require('ws').Server;
let port = 8888;
let wss = new WebSocketServer({port:port});
let messages = [];

wss.on('connection', function(ws){
  messages.forEach(function(message){
    ws.send(message);
  });

  ws.on('message',function(message){
    message.push(message);
    console.log('Message Received : %s',message);
    wss.clients.froEach(function(conn){
      conn.send(message);
    });
  });
});
