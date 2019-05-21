const http=require("http");
const fs=require("fs");
const io=require("socket.io");
const url=require('url');
let server=http.createServer();
let ws=io(server);
server.on("request",function(req,res){
    let pathObj=url.parse(req.url);
    let pathname=pathObj.pathname;
    console.log(pathname);
});
server.listen(3000,function(){
    console.log("server is running");
});
ws.on("connection",function(socket){
    socket.emit('news',{ hello:'world' });
});