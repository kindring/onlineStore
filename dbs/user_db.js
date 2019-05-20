//用户模块.提供用户的增查功能
const mongo=require('mongoose');
const  Schema=mongo.Schema;
let error_obj={
    error:null,
    errCode:null,
    describe:null,
};

mongo.connect('mongodb://localhost/itcast',{useNewUrlParser:true});
const userSchema=new Schema({
    pid:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    birthday:{
        type:String,
    },
    brief:{
        type:String,
    },
    money:{
        type:Number,
    }
});
const user=mongo.model("user",userSchema);

function check(fileds,value){
    //邮箱正则
    value=value.toString();
    let email_reg=new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    let password_reg=/[0-9a-z]{5,16}/i;//密码正则
    let name_reg=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]{1,9}","i");//异常字符检查
    let number_reg=/^-?[1-9]\d*$/;//数字字段检查
    let this_bo=false;//数据合法性标识合法返回true,不合法返回false
    switch (fileds){
        case "user_id":
            if(number_reg.test(value)){
                this_bo=false;
            }else{
                this_bo=true;
            }
            break;
        case "id":
            if(number_reg.test(value)){
                this_bo=true;
            }else{
                this_bo=false;
            };
            break;
        case "user_email":
            if(email_reg.test(value)){
                this_bo=true;
            }else{
                this_bo=false;
            }
            break;
        case "email":
            if(email_reg.test(value)){
                this_bo=true;
            }else{
                this_bo=false;
            }
            break;
        case "password":
            if(password_reg.test(value)){
                this_bo=true;
            } else{
                this_bo=false;
            }
            break;
        case "name":
            if(!name_reg.test(value)){
                this_bo=true;
            }else{
                this_bo=false;
            }
            break;
        case "user_name":
            if(!name_reg.test(value)){
                this_bo=true;
            }else{
                this_bo=false;
            }
            break;
        case "identity":
            if(!number_reg.test(value)){
                this_bo=false;
            }else{
                this_bo=true;
            }
            break;
        case "banner":
            if(!name_reg.test(value)){
                this_bo=true;
            }else{
                this_bo=false;
            }
            break;
        case "header":
            this_bo=true;
            break;
        case "header_url":
            this_bo=true;
            break;
        default :
            console.log(`该字段我们这里没有收录呢!亲---\n查询的字段:${fileds}\n该字段需要查询的数据:${value}`);
            break;
    }
    return this_bo;
};//匹配非法字符
//传入正则和值如果匹配则返回true否则返回false
function adduser(json,callback){
    if(!json.password||!json.name||!json.email){
        error_obj.errCode=999;
        error_obj.error="广告位招租";
        error_obj.describe="注册用户时数据缺失了";
        return callback(error_obj);
    }
    if(!check("password",json.password)||!check("name",json.name)||!check("email",json.email)){
        error_obj.errCode=110;
        error_obj.error="广告位招租";
        error_obj.describe="数据异常,无法注册";
        return callback(error_obj);
    }
    let promise=new Promise((resolve, reject) => {
        user.findOne({email:json.email},function(err,data){
            if(err){
                error_obj.errCode=555;
                error_obj.error=err;
                error_obj.describe="在检测邮箱是否注册过时,出现了未知服务器错误.";
                return reject(error_obj)
            }
            if(data){
                error_obj.errCode=1010;
                error_obj.describe="该邮箱已经注册过";
                error_obj.error="注册失败!广告位招租";
                return reject(error_obj)
            }
            resolve()

        });
    });

    promise.then(()=>{
        newPid(function(pid){
            let newUser=new user({
                pid:pid,
                email:json.email,
                password:json.password,
                name:json.name,
                money:0,
                brief:"这个人还没有简介",
                birthday:"1999-1-1"
            });
            newUser.save(function(err,result){
                if(err){
                    error_obj.error=err;
                    error_obj.describe="保存用户信息时出现错误";
                    error_obj.errCode=555;
                    return callback(error_obj);
                }
                callback(null,result);
            })
        })
    },(err)=>{
        return callback(err);
    })
}
function login(json,callback){
    if(!json.password||!json.email){
        error_obj.errCode=999;
        error_obj.describe="用户数据缺失";
        error_obj.error="登录失败,数据缺失";
        return callback(error_obj);
    }
    if(!check("password",json.password)||!check("email",json.email)){
        error_obj.errCode=110;
        error_obj.describe="数据格式错误";
        error_obj.error="数据格式错误,招租";
        return callback(error_obj);
    }
    user.findOne({password:json.password,email:json.email},function(err,data){
        if(err){
            error_obj.describe="登录时出现了异常!";
            error_obj.errCode=555;
            error_obj.error="招租";
            return callback(error_obj);
        }
        console.log("登录----");
        console.log(data);
        if(!data){
            error_obj.describe="用户不存在";
            error_obj.errCode=404;
            error_obj.error="招租";
            return callback(error_obj);
        }
        return callback(null,data);
    })
}
function findPid(pid,callback){
    if(check("id",pid)){
        user.findOne({pid:pid},function(err,data){
            if(err){
                error_obj.errCode=555;
                error_obj.describe="查找用户服务器出现问题";
                error_obj.error=err;
                return callback(error_obj);
            }
            return callback(null,data);
        })
    }else{
        error_obj.errCode=110;
        error_obj.describe="查找用户数据出现问题";
        error_obj.error="数据不合法";
        return callback(error_obj);
    }
}

function change_describe(json,callback){
    if(!json.pid){
        return callback({
            describe:"数据缺失无法查询",
            error:"修改数据时",
            errCode:"999"
        })
    }
    let obj={};
    for(let i in json){
        if(i!="pid"){
            obj[i]=json[i];
        }
    }
    user.updateOne({pid:json.pid},obj,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null,result);
    })
}

function newPid(callback){
    let pid=generate();
    user.findOne({pid:pid},function(find_pid_err,data){
        if(find_pid_err){
            error_obj.errCode=555;
            error_obj.error=find_pid_err;
            error_obj.describe="在检测是否有相同的pid时,出现了未知服务器错误.";
            return callback(error_obj);
        }
        if(data){
            newPid(callback)
        }else{
            return callback(pid);
        }
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

exports.adduser=adduser;
exports.login=login;
exports.findPid=findPid;
exports.change_describe=change_describe;