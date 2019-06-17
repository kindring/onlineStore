const http=require('http');
const path=require('path');
const url=require('url');
const met=require('./model/Methods.js');//请求方法模块
const staticUse=require('./model/static.js');//静态文件托管模块
const fs=require('fs');
let server=http.createServer();

let a_herf=require('./a_herf.json');//用来保存a链接的文件夹

let admin_password=generate();
server.on('request',(req,res)=>{
    let pathObj=url.parse(req.url);
    let pathname=pathObj.pathname;//无查询字符串的请求路径
    console.log(`${req.method}:${pathname}`);
    let extname=path.extname(pathname);//获取文件操作
    if(extname){
        //静态文件请求
        //抛给专门的文件处理模块
        staticUse.resFile(res,pathname,extname)
    }else{
        let method=req.method.toLowerCase();//1.获取请求方法method     2.将其转换为小写的字母
        //通过switch方法将请求方法适配不同的方法
        met.mateTask(method,pathObj,req,res);
    }
});

exports.listen=function(port,ip,fn){
    server.listen(port,ip,fn);
    console.log("管理员的随机密码为:"+admin_password);
};
exports.use=function(rQ,fP){
    // fP=fP.split('/')[1]
    staticUse.staticUse.push({
        rQ:rQ,
        fP:fP
    })
};
function generate(){
    //生成随机令牌
    let x1=parseInt(Math.random()*9);
    let x2=parseInt(Math.random()*7);
    let x3=parseInt(Math.random()*8);
    let x4=parseInt(Math.random()*7);
    let x5=parseInt(Math.random()*6);
    let x6=parseInt(Math.random()*9);
    return `${x1}${x2}${x3}${x4}${x5}${x6}`;
}
exports.get=function(path,fn){
    if(typeof(path)=="object"&&path.test!==null){
        let l=met.getRegularList.length||0;
        met.getRegularList[l]={
            Regular:path,
            fn:fn,
        };
        // console.log(getRegularList)
    }else if(typeof(path)=='string'){
        let newPath=path;
        if(path.substr(0,1)!='/'){
            newPath='/'+path;
        }else{
            newPath=path;
        }
        met.getTask[path]={
            fn:fn,
            path:newPath,
        };
    }
};
exports.post=function(path,fn,json){
    console.log(`设置路径path:${path}`);
    if(typeof(path)=="object"&&path.test!==null){
        let l=met.postRegularList.length||0;
        met.postRegularList[l]={
            Regular:path,
            fn:fn,
            josn:json,
        }
    }else if(typeof(path)=='string'){
        let newPath=path;
        if(path.substr(0,1)!='/'){
            newPath='/'+path;
        }else{
            newPath=path;
        }
        met.postTask[path]={
            fn:fn,
            path:newPath,
            json:json
        };
    }
};
function parseCookie(req){
    let Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return Cookies;
}
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

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(str.indexOf('{')>-1){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log(e);
            return false;
        }
    }
    return false;
}
exports.isJSON=isJSON;
exports.parseCookie=parseCookie;
exports.parseBody=parseBody;
exports.admin_password=admin_password;//导出密码数据
exports.a_herf=a_herf;
exports.save_a=function(){
    let tagtePath=path.join(__dirname,'a_herf.json');
    let str=JSON.stringify(a_herf);
    fs.writeFile(tagtePath,str,function(err,result){
        if(err){
            return console.log(err.message);
        }
        console.log(result);
    })
};

console.log(a_herf);