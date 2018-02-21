let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/',function(req,res){
  res.sendFile(__dirname + '/index.htm');
});

io.on('connection',function(socket){
  console.log('someone comes in');

});


http.listen(8888,function(){
  console.log('listen on 8888');
});

