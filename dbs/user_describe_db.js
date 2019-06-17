const mongo=require('mongoose');
const  Schema=mongo.Schema;
mongo.connect('mongodb://localhost/itcast',{useNewUrlParser:true});
let error_obj={
    error:null,
    errCode:null,
    describe:null,
};
const describeSchema = new Schema({
    pid:{
        type:String,
        require:true,
    },
    name:{
        type:String,
        require:true,
    },
    money:{
       type:String,
       require:true,
    },
    brief:{
        type:String,
    },
    birthday:{
        type:String,
    },
    shop_id:{
        type:String,
    }
});
let describe=mongo.model('describe',describeSchema);
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
function change(json,callback){
    if(!json.pid||!json.name){
        return callback({
            describe:"数据缺失,无法添加用户数据",
            error:"在添加用户详情时",
            errCode:999,
        })
    }
    let obj={
        pid:json.pid,
        money:json.money||0,
        brief:json.brief||"该用户很懒,还没有简介呢",
        birthday:json.birthday||"1990-1-1",
    };
    find(json.pid,function(err,data){
        if(err){
            return callback(err);
        }
        if(!data){
            let newDescribe=new describe(obj);
            newDescribe.save(function(err,result){
                if(err){
                    return callback({describe:"未知的服务器错误",errCode:555,erroe:err});
                }
                return callback(null,result);
            });
        }
        obj={
            name:json.name,
            money:json.money||data.money,
            brief:json.brief||data.brief,
            birthday:json.birthday||data.birthday,
        };
        describe.updateOne({pid:data.pid},obj,function(err,result){
            if(err){
                return callback({
                    errCode:555,
                    describe:"在更新用户数据操作时",
                    error:err,
                })
            }
            return callback(null,{
                pid:data.pid,
                money:obj.money,
                brief:obj.brief,
                birthday:obj.birthday,
            })
        });
    });
}
function add(json,callback){
    if(!json.pid||!json.name){
        return callback({
            describe:"数据缺失,无法添加用户数据",
            error:"在添加用户详情时",
            errCode:999,
        })
    }
    let obj={
        pid:json.pid,
        name:json.name,
        money:json.money||0,
        brief:json.brief||"这个人很懒",
        birthday:json.birthday||'1900-1-1'
    }
    let newDescribe=mongo.Schema
}
function find(pid,callback){
    if(!pid){
        return callback({
            errCode:999,
            describe:"必须要有用户的pid信息",
            error:"添加用户数据时"
        });
    }
    if(!pid){
        return callback({
            errCode:999,
            describe:"必须要有用户的pid信息",
            error:"添加用户数据时"
        });
    }
    if(check('id',pid)){
        return callback({
            errCode:110,
            describe:"用户pid数据不合法",
            error:"添加用户数据时"
        })
    }
    describe.findOne({pid:pid},function(err,data){
        if(err){
            return callback({
                error:err,
                describe:"在通过查找用户详情时出现错误",
                errCode:555,
            });
        }
        callback(null,data);
    });
}
function addMoney(pid,money){
    console.log("用户添加金钱")
}
function subMoney(pid,money){
    console.log("用户使用金钱")
}
exports.change=change;
exports.find=find;
