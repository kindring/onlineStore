const page=require('./page.js');
const user=require('./user.js');
const admin=require('./admin.js');







function parseBody(req,callback){
    let body=[];
    let size=0;
    req.on("data",function(chunk){
        body.push(chunk);
        size+=chunk.length;
    });
    req.on("end",function(){
        body=Buffer.concat(body,size).toString();
        callback(body)
    })
}
function parseCookie(req){
    let Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return Cookies;
}
