const SMSClient = require('@alicloud/sms-sdk');
const accessKeyId = 'LTAIIFZzvHdkkGF8';
const secretAccessKey = 'dWB8egTujImjMTnN76zZ9MnQaxR37F';

let smsclient = new SMSClient({accessKeyId, secretAccessKey});

smsclient.sendSMS({
  PhoneNumbers:'18006200976,13013786354',
  SignName:'义利盟FP01',
  TemplateCode:'SMS_125028490',
  TemplateParam:'{"TPV":"8.3","TSV":"100.0","TMV":"34","Alarms":"超温"}',
}).then(function(res){
  let {Code}=res;
  console.log(Code);
 });

