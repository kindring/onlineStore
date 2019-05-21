const mysql=require('mysql');
let connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'onlinestore'
});
connection.connect();
let error_obj={
    //自定义错误对象
    errCode:null,
    error:null,
    describe:null,
};
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
            if(!number_reg.test(value)){
                this_bo=false;
            }else{
                this_bo=true;
            }
            break;
        case "id":
            if(!number_reg.test(value)){
                this_bo=true
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
function find(table,fileds,value,callback){
    //生成sql语句
    table=table.toString();
    fileds=fileds.toString();
    value=value.toString();
    let sql="select * from "+table+" where "+fileds+" = "+value;
    connection.query(sql,function(err,result,fields){
        if(err){
            return callback(err);
        }
        return callback(null,result,fields)
    })
};//查找该数据库下面的指定字段的数据
//传入用户id和修改的内容的key:value值进行修改
function change(table,changes,callback){
    if(!changes.user_id){
       error_obj.errCode=999;
       error_obj.describe="用户id数据缺失,拒绝操作!修改的数据体应是一个包含修改字段和修改的内容的key:value键值对";
       error_obj.error="广告招租";
       return callback(error_obj);
    }
    //检测用户是否存在
    find_id(table,changes.user_id,(err,results)=>{
        if(err){ return callback(err);}
        if(results.length<1){
            error_obj.Code=404;
            error_obj.describe="查找失败了请检查用户id是否正确";
            error_obj.error="招租";
            return callback(error_obj);
        }
        let sql="update "+table+" set";
        let fildes_number=0;
        for(let key in changes){
            if(changes[key]!==changes.user_id){
                if(!check(key,changes[key])){
                    error_obj.errCode=110;
                    error_obj.describe=`字段${key}的数据:${changes[key]}不合法`;
                    error_obj.error="自定义错误";
                    return callback(error_obj);
                }
                fildes_number++;
                if(fildes_number===1){
                    sql+=" "+key.toString()+" = '"+changes[key].toString()+"' ";
                }else{
                    sql+=","+key.toString()+" = '"+changes[key].toString()+"' ";
                }

            }//合法检测
        }
        sql+="where "+table.toString()+"_id="+changes.user_id.toString();
        //console.log(`生成的sql语句为${sql}`);
        connection.query(sql,function(err,result,fields){
            if(err){
                error_obj.errCode=555;
                error_obj.error=err;
                error_obj.describe="错误描述我也不知道说啥,自己看";
                return callback(err);
            }
            return callback(null,result);
        })
    })
};
function findEmail(email,callback){
    if(!check("email",email)){
       error_obj.errCode=110;
       error_obj.describe="该方法只接受一个正确的邮箱";
       callback(error_obj);
    }
    // 生成查询语句
    if(typeof(email)!==String){
        email=email.toString();
    }
    let sql="select * from user where user_email='"+email+"'";
    connection.query(sql,function(err,results,fields){
        if(err){
            console.log('在查找匹配邮箱时出现了错误');
            return callback(err)
        }
        return callback(null,results,fields);
    })
}//通过邮箱查找用户数据
function find_id(table,id,callback){
    let re=/^-?[1-9]\d*$/;
    if(!re.test(id)){
        error_obj.errCode=110;
        error_obj.describe="id查找的id数据不合法";
        error_obj.error="广告位招租";
        return callback(error_obj);
    }
    find(table,table+'_id',id,function(err,result,fileds){
        if(err){
            error_obj.errCode=666;
            error_obj.describe="未定义的未知错误.来源查找用户id";
            error_obj.error=err;
           return callback(error_obj);
        }
        return callback(null,result)
    })
}//通过id查找用户数据
function find_name(table,name,callback){

}//通过name字段查找数据
function adduser(json,callback){
    console.log(json);
    //数据缺失调用回调
    if(!json.email||!json.password||!json.name){
        //注册数据请求缺失
        error_obj.errCode=999;
        error_obj.describe="用户数据缺失,拒绝注册";
        error_obj.error="广告位招租";
        return callback(error_obj);
    }
    //检查数据是否合法
    if(!check("user_email",json.email)||!check("user_name",json.name)||!check("password",json.password)){
        error_obj.errCode=110;
        error_obj.describe="用户数据不合法,拒绝操作!!!";
        error_obj.error="广告位招租";
        return callback(error_obj);
    }
    //查询是否重复注册
    let promise=new Promise((resolve,reject)=>{
        findEmail(json.email,function(err,result,fields){
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    });
    promise.then((value)=>{
        if(value.length!==0){
            error_obj.errCode=1010;
            error_obj.describe="该邮箱已经注册过了无需注册";
            error_obj.error="广告位招租";
            return callback(error_obj);
        }else{
            //生成添加sql语句
            let email=json.email.toString();
            let name=json.name.toString();
            let password=json.password.toString();
            let sql="insert into user(user_email,user_name,password) values ('"+email+"','"+name+"','"+password+"')";
            connection.query(sql,function(err,result,fields){
                if(err){
                    let repeatReg=/Duplicate entry/;
                    if(repeatReg.test(err['sqlMessage'])){
                        error_obj.errCode=1010;
                        error_obj.describe="这个错误大概是该用户已经存在,存在大量同时操作\n自己看错误详情";
                        error_obj.error=err;
                        return callback(error_obj);
                    }else{
                        error_obj.errCode=555;
                        error_obj.describe="我也不知道是个什么鬼问题,具体自己看错误信息\n错误来源:数据库的添加用户步骤";
                        error_obj.error=err;
                        return callback(error_obj);
                    }

                }
                callback(null,result);
            })
        }
    },(err)=>{
        callback(err);
    })
}//添加用户
// adduser({
//
// },function(err,data){
//
// });
function addshop(json,callback){
    if(!json.user_id||!check("user_id",json.user_id)||!json.shop_name||!check("name",json.shop_name)){
        error_obj.errCode="999 or 110";
        error_obj.describe="添加店铺应该包含用户的id,以及店铺的名称,或者是进行修改的user_id数据不合法";
        error_obj.error="---招---租---";
        return callback(error_obj);
    }
    //查询用户数据
    find_id("user",json.user_id,(err,data)=>{
        if(err){return callback(err)}
        if(data.length<1){
            error_obj.errCode=404;
            error_obj.describe="需要的用户不存在请检查";
            error_obj.error="广告位招租";
            return callback(error_obj);
       }//是否存在检测
        console.log(data[0]["identity"]);
        if(data[0]["identity"]==1){
            error_obj.errCode=1212;
            error_obj.describe="失败!该用户已经拥有店铺,无法注册";
            error_obj.error="广告位招租";
            return callback(error_obj);
        };
        let sql="insert into shop";
        let fileds="(";
        let values="values(";
        let number=0;
        for(let key in json){
            if(key!=="user_id"||key!=="shop_id"){
                number++;
                if(number===1){
                    fileds+=key.toString();
                    values+=" '"+json[key].toString()+"' ";
                }else{
                    fileds+=","+key.toString();
                    values+=",'"+json[key].toString()+"' ";
                }
            }
        }
        fileds+=") ";
        values+=")";
        sql +=fileds + values;
        console.log(`生成的sql语句为${sql}`);
        connection.query(sql,function(err,result,fileds){
            if(err){
                error_obj.errCode=555;
                error_obj.describe="如果没猜错应该的店铺名称重复了,具体看错误信息";
                error_obj.error=err;
                return callback(error_obj);
            }
            return callback(result)
        })
    })
};//添加店铺
function login(json,callback){
    if(!json.email||!json.password){
        error_obj.errCode=110;
        error_obj.describe="数据缺失!无法操作";
        error_obj.error=null;
        return callback(error_obj);
    }
    if(!check("email",json.email)||!check("password",json.password)){
        error_obj.errCode=110;
        error_obj.describe="数据格式错误!拒绝登录";
        error_obj.error=null;
        return callback(error_obj);
    }
    let sql="select * from user where user_email = '"+json.email.toString()+"' and password = '"+json.password.toString()+"'";
    console.log(sql);
    connection.query(sql,function(err,result,fileds){
        if(err){
            error_obj.errCode=555;
            error_obj.describe="不清楚是服务器还是啥地方出错误";
            error_obj.error=err;
            return callback(error_obj);
        }
        if(result.length<1){
            error_obj.errCode=404;
            error_obj.describe="用户邮箱或者密码填写错误";
            error_obj.error="广告位招租";
            return callback(error_obj);
        }
        return callback(null,result);
    })


}


/*添加店铺测试*/
addshop({
    user_id:1,
    shop_name:"巴黎圣母院",
},function(err){
    if(err){
        console.log(err)
    }
});

exports.adduser=adduser;
exports.login=login;
exports.autoLogin=function(id,callback){
    find_id('user',id,callback)
};


