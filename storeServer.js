const http=require('http');
const path=require('path');
const url=require('url');
const met=require('./model/Methods.js');//请求方法模块
const staticUse=require('./model/static.js');//静态文件托管模块
let server=http.createServer();
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
};
exports.use=function(rQ,fP){
    // fP=fP.split('/')[1]
    staticUse.staticUse.push({
        rQ:rQ,
        fP:fP
    })
};
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