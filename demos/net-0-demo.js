const net =require('net');

let server=net.createServer();
let num=0;
server.on('connection',function(socket){
   console.log('客户端连接');
   // console.log(socket.remotePort);
   // console.log(socket.remoteAddress);
   // console.log('这是服务器信息');
   // console.log(socket.localPort);
   // console.log(socket.localAddress);
    socket.on('data',function(data){

    });
    num++;
    let buf=Buffer.from(str);
    // buf.setEncoding('utf-8');
   socket.write()
});

server.on('listening',()=>{
   console.log('监听中-----')
});

server.listen(3000,'127.0.0.1');