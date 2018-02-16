let express = require('express');
let app = express();
let serialP1 = require('serialport');
let bodyParser = require('body-parser');
//const Ready = serialP1.parsers.Ready;
//let ByteLength = serialP1.parsers.ByteLength;

//const CCTalk = serialP1.parsers.CCTalk;
let serialP1Buf = {
  index:0,
  buf: new Buffer(25),
  f03:Buffer.from([0x01,0x03,0x08]),
  f06:Buffer.from([0x01,0x06,0x00])
  
}
/*
WEB
*/
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
  res.sendFile('/home/pi/AI516/index.htm');
});

app.get('/run',function(req,res){
  console.log(req);
  res.send('running');
  //parser = null;
  //parser = AI516.pipe(new ByteLength({length:8}));
  AI516.write([0x01,0x06,0x00,0x1B,0x00,0x00,0xF9,0xCD]);
});

app.get('/stop',function(req,res){
  AI516.write([0x01,0x06,0x00,0x1B,0x00,0x01,0x38,0x0D]);
  res.send('stopped');
});

app.get('/getvalue',function(req,res){
  AI516.write([0x01,0x03,0x00,0x1B,0x00,0x08,0x34,0x0B]);
});

app.listen(8888);
/*
seiral port
*/

let AI516 = new serialP1('/dev/ttyUSB0',{
  baudRate:19200,
  dataBits:8,
  stoBits:1,
  parity:'none'
});

//let parser = AI516.pipe(new ByteLength({length:13}));
//const parser = AI516.pipe(new CCTalk());
//parser.on('data',console.log);

//parser.on('ready',()=> console.log("ready to go"));

AI516.on('data',function(data){
    //console.log(data.length);
  data.copy(serialP1Buf.buf,serialP1Buf.index,0,data.length);
  serialP1Buf.index += data.length;
  console.log(serialP1Buf.index);
  if(serialP1Buf.buf.indexOf(serialP1Buf.f03) >=0 && serialP1Buf.index >= 13){
    serialP1Buf.index = 0;
    console.log(serialP1Buf.buf);
  }else if
  //console.log(serialP1Buf.buf);
  
  //console.log(serialP1Buf.buf.indexOf(serialP1Buf.f03));
//  console.log(serialP1Buf.index);
/*
  if(serialP1Buf.buf.indexOf(serialP1Buf.f03) != -1 && serialP1Buf.buf.length >=13){
    console.log(serialP1Buf.buf.slice(0,14));
    serialP1Buf.index = 0;
  }
  */
	//interpret(data);
});


function interpret(data){
  data = data.concat(data);
  if(data.length >= 13){
    console.log(data);
  }
}



function getv(){
/*  AI516.flush(function(err,result){
    console.log(result);
  });
  */
  //AI516.read();
  //parser = null;
  //parser = AI516.pipe(new ByteLength({length:13}));
  AI516.write([0x01,0x03,0x00,0x1B,0x00,0x08,0x34,0x0B]);
}



/*
AI516.on('data',function(data){
  console.log(data);
});
*/

let t1 = setInterval(getv,1000);
//setTimeout(function(){AI516.read()},5000);
