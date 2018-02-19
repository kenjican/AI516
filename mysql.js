const mysql = require('mysql');
const con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'chenjia1!',
  database:'AI516',
});

con.connect((err)=>{
  if(err){
    console.log('eror');
    return;
  }

  console.log('connection ok');
});
/*
con.query('select * from vtiger_account where accountid <=565',function(err,rows,fields){
  console.log(rows);
});
*/

con.query('insert into AI516_1 (TPV,TSV,Alarms) values (110,150,0x0103)')

con.end((err)=>{
  console.log('error and exit');
});
