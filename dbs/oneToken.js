const mongo=require('mongoose');
const  Schema=mongo.Schema;

let error_obj={
  error:null,
  errCode:null,
  describe:null,
};
mongo.connect('mongodb://localhost/itcast',{useNewUrlParser:true});
const tokenSchema=new Schema({
    token:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    pid:{
        type:String,
        required:true,
        unique:true,
    },
    ip:{
        type:String
    }
});
const token=mongo.model('Token',tokenSchema);

function addtoken(json,callback){
    if(!json.email||!json.pid){
        error_obj.error="广告位招租";
        error_obj.describe="该方法第一个参数必须为带用户id和邮箱的json";
        error_obj.errCode=999;
        return callback(error_obj);
    }
    find(['pid','email'],[json.pid,json.email],function(find_err,find_ter){
        if(find_err){
            return callback(find_err);
        }
        if(find_ter){
            update(json.pid,function(update_err,update_ret){
                if(update_err){
                    return callback(update_err);
                }
                return callback(null,{
                    token:update_ret.token,
                    email:json.email,
                    pid:json.pid,
                });
            })
        }else{
            let Token=generate();
            console.log("token:"+Token);
            console.log("email:"+json.email);
            console.log("pid:"+json.pid);
            let newToken=new token({
                token:Token,
                email:json.email,
                pid:json.pid,
            });

            newToken.save((err,ret)=>{
                if(err){
                    error_obj.error=err;
                    error_obj.errCode=500;
                    error_obj.describe="未知的服务器错误俺也不知道";
                    console.log(error_obj);
                    return callback(error_obj)
                }
                return callback(null,{
                    token:ret.token,
                    email:ret.email,
                    pid:ret.pid,
                })
            })
        }
    });
}
function find(fields,values,callback){
    if(typeof(fields)=='string'&&typeof(values)=='string'){
        token.findOne({[fields]:values},function(err,ter){
            if(err){
                error_obj.errCode=555;
                error_obj.error=err;
                error_obj.describe="未知错误无描述";
                return callback(error_obj);
            }
            return callback(null,ter);
        })
    }else if(fields.length===values.length){
        let sql_obj={};
        for(let i=0;i<fields.length;i++){
            sql_obj[fields[i]]=values[i];
        }
        token.findOne(sql_obj,function(err,ter){
            if(err){
                error_obj.errCode=555;
                error_obj.describe="具体描述我也不知道,也许是字符串拼接出错了";
                error_obj.error=err;
                return callback(err);
            }
            return callback(null,ter);
        })
    }else if(typeof(fields)=="object"&&typeof(values)=="function"){
        token.findOne(fields,function(err,ter){
            if(err){
                error_obj.errCode=555;
                error_obj.describe="具体描述我也不知道,也许是字符串拼接出错了";
                error_obj.error=err;
                return values(err);
            }
            return values(null,ter);
        })
    }else{
        error_obj.errCode=110;
        error_obj.describe="参数错误!!!,参数可以是前两个为字段和值.第三个为callback.\n也可以是第一个参数为json的键值对第二个参数为callback"
        error_obj.error=null;
        console.log(error_obj);
        throw error_obj;
    }

};
function update(pid,callback){
    let newToken=generate();
    token.updateOne({pid:pid},{token:newToken},(err,ter)=>{
        if(err){
            error_obj.errCode=555;
            error_obj.describe="更新数据异常!操作失败";
            error_obj.error=err;
            return callback(error_obj);
        }
        return callback(null,{token:newToken,pid:pid});
    })
}
function remove(pid,callback){
    token.deleteOne({pid:pid},function(err,data){
        if(err){
            return callback({
                errCode:"555",
                describe:"删除数据时出现bug",
                error:err,
            })
        }
        return callback(null,data)
    })
}
function generate(){
    //生成随机令牌
    let x1=parseInt(Math.random()*9);
    let x2=parseInt(Math.random()*7);
    let x3=parseInt(Math.random()*8);
    let x4=parseInt(Math.random()*7);
    let x5=parseInt(Math.random()*6);
    return `${x1}${x2}${x3}${x4}${x5}`;
}

exports.remove=remove;
exports.addToken=addtoken;
exports.upDate=update;
exports.find=find;