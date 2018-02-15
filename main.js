let express = require('express');
let app = express();
let serialP1 = require('serialport');
let bodyParser = require('body-parser');
//const Ready = serialP1.parsers.Ready;
let ByteLength = serialP1.parsers.ByteLength;
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
  AI516.write([0x01,0x06,0x00,0x1B,0x00,0x00,0xF9,0xCD]);
});

app.get('/stop',function(req,res){
  AI516.write([0x01,0x06,0x00,0x1B,0x00,0x01,0x38,0x0D]);
  res.send('stopped');
});

app.get('/getvalue',function(req,res){
  AI516.write([0x01,0x03,0x00,0x00,0x00,0x08,0x44,0x0C]);
});

app.listen(8888);
/*
seiral port
*/

let AI516 = new serialP1('/dev/ttyUSB0',{
  baudRate:19200,
  dataBits:8,
  stoBits:2,
  parity:'none'
});

const parser = AI516.pipe(new ByteLength({length:13}));

parser.on('data',console.log);

//parser.on('ready',()=> console.log("ready to go"));
/*
AI516.on('data',function(data){
    //console.log(data.length);
   interpret(data);
});
*/


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
  AI516.read();
  AI516.write([0x01,0x03,0x00,0x00,0x00,0x08,0x44,0x0C]);
}



/*
AI516.on('data',function(data){
  console.log(data);
});
*/

let t1 = setInterval(getv,10000);

