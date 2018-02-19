const http = require('http');
const server = http.createServer((req,res)=>{
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`your ip is ${ip} , port is ${port}`);
}).listen(80);
