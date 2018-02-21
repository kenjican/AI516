1:how to parse feedback for modubs 03 and 06 function? By delimiter,ByteLength,or Regex?
solution: while event data on is triggered,copy read buffer to append another buffer,
  and verify the modbus 03 and 06 pattern, like [0x01,0x03,0x08] , [0x01,0x06,0x00].If   matches means got the first pointer of feedback data.Then, calculate the buffer length if more than 8 or 13,,,parse the buffer.

cons:no CRC validation 

2:P2P communication, webRTC is one of the options. it need a server to get external(public) IP and pot.
  A little frustrationg problem....postpone..

3:push data , not to AJAX polling. it could get real time data.
solution:

