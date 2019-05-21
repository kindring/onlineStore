const fs=require('fs');
const path=require('path');
const url = require('url');
let getTask={};//get方法存储对象
let getRegularList=[];//get方法的正则列表
let postTask={};//post方法
let postRegularList=[];//post正则
let putTask={};//put方法
let putRegularList=[];//put正则
let deleteTask={};//deleteTask方法
let deleteRegularList=[];//delete正则
let resource=path.join(__dirname,'../views/');
//掏出接口---Big *** ***
exports.getTask=getTask;
exports.getRegularList=getRegularList;
exports.postTask=postTask;
exports.postRegularList=postRegularList;
exports.mateTask=function(method,pathObj,req,res){
    //把请求方法和请求路径一起发送给这个方法
    let callback=null;
    switch(method){
        case 'get':
            callback=task(pathObj.pathname,getTask,getRegularList);
            break;
        case 'post':
            callback=task(pathObj.pathname,postTask,postRegularList);
            break;
        case 'put':
            callback=task(pathObj.pathname,putTask,putRegularList);
            break;
        case 'delete':
            callback=task(pathObj.pathname,deleteTask,deleteRegularList);
            break;
    }
    if(callback!==null){
        let Mreq=req;
        let Mres=res;
        Mreq.pathname=pathObj.pathname;
        Mreq.pathQuery=pathObj.query;
        Mreq.Pquery=url.parse(req.url, true).query;
        Mreq.pathAll=pathObj;
        Mreq.pathObj=pathObj;
        Mres.render=function(file){
            Render(res,file);
        };
        Mres.json=function(json){
            res.writeHead(200,"Content-Type","application/json");
            res.end(JSON.stringify(json));
        };
        Mres.redirect=function(url){
            res.setHeader('Location',url);
            res.writeHeader(302);
            res.end('Redirect to ' + url);
        };
        Mres.err=function(err,code){
            if(err){
                if(err.errCode){
                    return res.end(JSON.stringify({describe:err.describe,errCode:err.errCode,}));
                }
                console.log(err);
                return res.end(JSON.stringify({describe:"服务器出现了未捕获的错误or异常",errCode:555,}));
            }
        };
        Mres.art=function(file,json,fn){
            Rfile(resource+file,function(err,data){
                if(err){
                    return Mres.err(err);
                }
                let html=fn(data.toString(),json);
                res.writeHead(200,{'Content-Type': 'text/html'});
                res.end(html)
            })
        };
        callback(Mreq,Mres);
    }

};

function task(path,task,RegularList){
    //封装匹配方法以多次复用
    if(task[path]){
        return task[path].fn
    }else{
        let reFn=null;
        for(let i =0;i<RegularList.length;i++){
            if(RegularList[i].Regular.test(path)){
                reFn=RegularList[i].fn;
                break;
            }
        }
        return reFn;
    }
}

function Rfile(path,callback,code){
    console.log(path);
    fs.readFile(path,code,function(err,data){
        if(err){
            return callback(err)
        }
        return callback(null,data)
    })
}
function Render(mres,file){
    Rfile(resource+file,function(err,data){
        if(err){
            console.log(err);
            mres.writeHead(200, {'Content-Type': 'text/plain'});
            mres.end('服务器错误')
        }else{
            console.log('渲染文件');
            //console.log(data.toString());
            mres.writeHead(200,{'Content-Type': 'text/html'});
            mres.end(data)
        }
    })
}