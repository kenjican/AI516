/***************
version :0.1
purpose: webUI of controller
Auther: Kenji Chen
Date: 2018-Feb-16
*/



let express = require('express');
let app = express();
let serialP1 = require('serialport');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let WebSocketServer = require('ws').Server;

/*
websocket setup
*/
let wss = new WebSocketServer({port:8887});

function sendall(buf){
  wss.clients.forEach(function(conn){
    //conn.send((buf.readInt16BE(3)/10).toString());
    conn.send(buf);
  });
}

/*
Mysql setup
*/


let con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'chenjia1!',
  database:'AI516',
});

con.connect(function(err){
  if(err) throw err;
});
/*
con.query(sql,function(err,result){
  if(!err) {console.log('1 recored added')}
});
*/
function aiparse(buf){
  let sql = 'insert into AI516_1 (TPV,TSV,Alarms,TMV) values(';
  sql += (buf.readInt16BE(3)/10) + ",";
  sql += (buf.readInt16BE(5)/10) + ",";
  sql += "0x" + buf.slice(7,8).toString("hex") + ",";
  sql += (buf.readUInt8(8)) + ")";
  sendall(sql);
  con.query(sql,function(err,result){
   if(err) throw err; 
  });
}


/*
serial port setup
*/

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
  res.sendFile('/home/kenji/AI516/index.htm');
});

app.get('/run',function(req,res){
  res.send('running');
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


AI516.on('data',function(data){
  data.copy(serialP1Buf.buf,serialP1Buf.index,0,data.length);
  serialP1Buf.index += data.length;
  //console.log(serialP1Buf.index);
  if(serialP1Buf.buf.indexOf(serialP1Buf.f03)>=0 && (serialP1Buf.index + serialP1Buf.buf.indexOf(serialP1Buf.f03)>= 13)){
    serialP1Buf.index = 0;
    //console.log(serialP1Buf.buf);
    aiparse(serialP1Buf.buf);
    //sendall(serialP1Buf.buf);
    getCRC(serialP1Buf.buf.slice(0,13));
  }else if(serialP1Buf.buf.indexOf(serialP1Buf.f06) >=0 && (serialP1Buf.index + serialP1Buf.buf.indexOf(serialP1Buf.f06)) >=8){
    serialP1Buf.index = 0;
    console.log(serialP1Buf.buf);
    getCRC(serialP1Buf.buf.slice(0,8));
  }
});


function getv(){
  AI516.write([0x01,0x03,0x00,0x1B,0x00,0x08,0x34,0x0B]);
}

function getCRC(buf){
  //console.log(Buffer.isBuffer(buf));
  let CRC = 0xffff;
  const XorConst = 0xA001;
  
  for(i=0;i<=buf.length-3;i++){
    CRC = CRC ^ buf[i];
      for(j=0;j<=7;j++){
        if(CRC % 2 ==0){
          CRC = CRC / 2;
        }else{
          CRC = (CRC-1)/2;
	  CRC = CRC ^ XorConst;
        }
      }
    }
  // console.log(CRC.toString(16));
}


let t1 = setInterval(getv,1000);
