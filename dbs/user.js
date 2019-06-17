const user=require('./user_db.js');
const head=require('./user_head_db');
const token=require('./oneToken.js');
const fs=require('fs');

exports.add_user=function(json,callback){
    user.adduser(json,function(err,data){
        if(err){
            return callback(err);
        }
    })
};

exports.find_user_pid=user.findPid;

exports.addtoken=token.addToken;
exports.find_token=token.find;
exports.update_token=token.upDate;
exports.login=function(json,callback){
    user.login(json,function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            return callback({
                errCode:404,
                describe:"无法找到用户数据",
                error:"招租"
            })
        }
        token.addToken({
            email:data.email,
            pid:data.pid,
        },function(err,token_data){
            if(err){
                console.log("token异常");
                return callback(err);
            }
            console.log(token_data);
            return callback(null,{
                email:data.email,
                name:data.name,
                token:token_data.token,
                pid:data.pid,
            })
        })
    })
};
exports.token_login=function(json,callback){
    if(!json.pid||!json.token){
        return callback({errCode:999,describe:"自动登录数据缺失",error:"招租"});
    }
    token.find({
        pid:json.pid,
        token:json.token,
    },function(err,token_data){
        if(err){
            return callback(err);
        }
        if(!token_data){
            return callback({
                errCode:404,
                describe:"token口令匹配失败",
                error:"招租"
            })
        }
        // console.log(`输入的token:${json.token}查询的结果${token_data}`);
        user.findPid(token_data.pid,function(err,user_data){
            if(err){
                return callback(err);
            }
            if(!user_data){
                return callback({errCode:404,describe:"用户信息不存在!",error:"这什么鬼"});
            }
            token.upDate(user_data.pid,function(err,newToken){
                console.log(`用户:${user_data.name}\n新的token口令为:${newToken.token}`);
                if(err){
                    return callback(err);
                }
                return callback(null,{
                    token:newToken.token,
                    pid:user_data.pid,
                    email:user_data.email,
                    name:user_data.name,
                    brief:user_data.brief,
                })
            })
        })
    })
};
exports.logout=function(json,callback){
    if(!json.pid||!json.token){
        return callback({
            errCode:"999",
            error:"操作失败",
            describe:"数据缺失无法进行操作",
        })
    }
    token.find({
        pid:json.pid,
        token:json.token,
    },function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            return callback({
                errCode:"404",
                error:"操作失败",
                describe:"无法查询到数据",})
        }
        token.remove(data.pid,function(err,data){
            if(err){
                return callback(err);
            }
            return callback(null,data);
        })
    })
};
exports.add_head=head.addHead;
exports.change_head=head.changeHead;

exports.describe=function(json,callback){
    if(!json.pid||!json.token){
        return callback({
            errCode:999,
            describe:"数据缺失,",
            error:"..."
        });
    }
    token.find({
        pid:json.pid
        ,token:json.token
    },function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            return callback({
                describe:"用户不存在,token口令查找失败",
                error:"查找用户口令时",
                errCode:"404",
            })
        }
        user.findPid(data.pid,function(err,describe){
            if(err){
                return callback(err);
            }
            return callback(null,{
                pid:describe.pid,
                name:describe.name,
                email:describe.email,
                birthday:describe.birthday,
                brief:describe.brief,
                money:describe.money,
            })
        })
    });
};
exports.change_describe=function(json,callback){
    if(!json.pid||!json.token){
        return callback({
            describe:"数据缺失",
            error:"修改用户数据时",
            errCode:999,
        })
    }
    user.change_describe(json,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null,result)
    });
};

exports.update=function(json,callback){
    if(!json.pid||!json.token){
        return callback({
            errCode:999,
            describe:"用户数据缺失",
            error:"没有"
        })
    }
    token.find({
        token:json.token,
        pid:json.pid
    },function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            return callback({
                describe:"用户数据匹配失败,token口令可能过期",
                errCode:404,
                error:"token口令可能过期"
            })
        }
        let obj={};
        obj.pid=data.pid;
        if(json.name){
            obj.name=json.name;
        }
        if(json.birthday){
            obj.birthday=json.birthday;
        }
        if(json.brief){
            obj.brief=json.brief;
        }
        if(json.password){
            obj.password=json.password;
        }
        if(json.path&&json.type){
            //读取文件
            let promise=new Promise((resolve,reject)=>{
                fs.readFile(json.path,function(err,file){
                    if(err){
                        return reject(err);
                    }
                    head.addHead({
                        pid:data.pid,
                        Ctype:json.type,
                        file:file
                    },function(err,res){
                        if(err){
                            return reject(err);
                        }
                        return resolve(res);
                    })
                });
            });
            let promise2=new Promise((resolve, reject)=>{
                user.change_describe(obj,function(err,result){
                    if(err){
                        return reject(err)
                    }
                    return resolve(result);
                })
            });
            let promiseAll=new Promise((resolve,reject)=>{
                let number=1;
                let _obj={
                    err:[],
                };
                promise.then(function(result){
                    number++;
                    if(number>=2){
                        return resolve(null,_obj);
                    }
                },function(error){
                    number++;
                    _obj.err.push({
                        describe:"修改头像失败",
                        error:error,
                        errCode:error.errCode,
                    });
                    if(number>=2){
                        return resolve(null,_obj);
                    }
                });
                promise2.then(function(result){
                    number++;
                    if(number>=2){
                        return resolve(null,_obj);
                    }
                },function(error){
                    number++;
                    _obj.err.push({
                        describe:"修改基本信息失败",
                        error:error,
                        errCode:error.errCode,
                    })
                    if(number>=2){
                        return resolve(null,_obj);
                    }
                })
            });
            promiseAll.then(function(value){

                return callback(null,value);
            })
        }else{
            user.change_describe(obj,function(err,result){
                if(err){
                    return callback(err)
                }
                return callback(null,result);
            })
        }
    })
};

exports.find_head=function(pid,callback){
    head.findPid(pid,function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            head.findPid('0000000',function(err,fileDt){
                if(err){
                    return callback(err);
                }
                return callback(null,{file:fileDt.file,type:fileDt.Ctype});
            })
        }else{
            return callback(null,{file:data.file,type:data.Ctype});
        }
    })
};
exports.autoLogin=function(pid,callback){
    user.findPid(pid,callback);
};