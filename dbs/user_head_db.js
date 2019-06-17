const mongo=require('mongoose');
const fs=require('fs');
const  Schema=mongo.Schema;
mongo.connect('mongodb://localhost/itcast',{useNewUrlParser:true});
let error_obj={
    error:null,
    errCode:null,
    describe:null,
};
const headSchema=new Schema({
    pid:{
        type:String,
        required:true,
        unique:true,
    },
    file:{
        type:"Buffer",
        required:true,
    },
    Ctype:{
        type:String,
        required:true,
    }
});

const head=mongo.model("heads",headSchema);
function findPid(pid,callback){
    head.findOne({pid:pid},(err,data)=>{
        if(err){
            return callback(err);
        }
        return callback(null,data);
    })
}
function change(json,callback){
    if(!json.pid||!json.file||!json.Ctype){
        return callback({describe:"数据缺失",errCode:999,error:"数据缺失"})
    }
    head.updateOne({pid:json.pid},{
        file:json.file,
        Ctype:json.Ctype
    },function(err,data){
        if(err){
            return callback({describe:"修改头像时出现bug",errCode:555,error:err});
        }
        return callback(null,data)
    })
}
exports.addHead=function(json,callback){
    if(!json.pid||!json.file||!json.Ctype){
        return callback({describe:"数据缺失",errCode:999,error:"数据缺失"})
    }
    findPid(json.pid,function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            let newHead=new head({
                pid:json.pid,
                file:json.file,
                Ctype:json.Ctype
            });
            newHead.save(function(err,result){
                if(err){
                    return callback({describe:"未知的服务器错误",errCode:555,erroe:err});
                }
                return callback(null,result);
            });
        }
        change(json,callback);
    });
};

function addddd(){
    //第一次启动的话调用此方法
    
   // fs.readFile("./views/imgs/head_title.png",function(err,data){
//     if(err){
//         return console.log(err);
//     }
//     console.log(data);
//     exports.addHead({
//         pid:'0000000',
//         file:data,
//         Ctype:"image/png"
//     },function(err,data){
//         if(err){
//             console.log(err);
//         }
//         console.log(data)
//     })
// }); 
}

exports.changeHead=change;
exports.findPid=findPid;


