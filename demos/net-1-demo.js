const net=require('net');

let client=net.createConnection({
    port:3000,
    host:'127.0.0.1'
});

client.on('content',function(socket){
    console.log(socket)
});

