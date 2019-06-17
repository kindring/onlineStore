const fs=require('fs');
const mongo=require('mongoose');
const  Schema=mongo.Schema;
mongo.connect('mongodb://localhost/itcast', {useNewUrlParser: true});

const carSchema = new Schema({
    gid:{
        type:String,
        required:true,
    },
    pid:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
    num:{
      type:Number,
      required:true,
    },
    add_sell:{
        type:Number,
        required:true,
    }
});

const car = mongo.model('cars',carSchema);

let add_car = function (json,callback){
    if(!json.pid||!json.gid||!json.add_sell||!json.num){
        return callback({
            error:"数据缺失",
            describe:"添加购物车必须要有gid和pid以及价钱与数量"
        })
    }
    let new_date=new Date();
    let new_car=new car({
        gid:json.gid,
        pid:json.pid,
        num:json.num,
        add_sell:json.add_sell,
        date:new_date,
    });
    new_car.save(function(err,result){
        if(err){
            return callback({
                error:err,
                describe:"查询数据时出现错误",
                errCode:"505"
            })
        }
        callback(null,result);
    })
};
//添加购物车测试用例
// add_car({
//     pid:4399,
//     gid:30068,
//     add_sell:1297,
//     num:5,
// },function(err,result){
//     if(err){
//         return console.log(err);
//     }
//     return result;
// });

let find = function (condition,skipNum,limitNum,nartural,callback){
    let query=car.find({});
    if(condition){
        query.where(condition)
    }
    skipNum=skipNum||0;
    limitNum=limitNum||50;//限制一次默认最多获取50条数据
    if(nartural!==null){
        query.sort({$natural:-1});
    }
    query.limit(limitNum);
    query.exec(function(err,docs){
        callback(err,docs);
    })

};

let change =function(pid,gid,num,callback){
    car.updateOne({
        pid:pid,
        gid:gid,
    },{
        num:num
    },function(err,result){
        if(err){
            return callback({
                error:err,
                describe:"修改购物车数量出现错误",
                errCode:505
            })
        }
        if(result.n===0){
            return callback({
                error:"匹配失败",
                describe:"修改购物车数量时",
                errCode:'404'
            })
        }
        callback(null,result);
    })
};
let del = function(pid,gid,callback){
    car.deleteOne({
        pid:pid,
        gid:gid,
    },function(err,result){
        if(err){
            return callback(err)
        }
        callback(result);
    })
};
// add_car({
//     num:1,
//     gid:4567,
//     pid:1234,
//     add_sell:1234.5
// },function(err,result){
//     if(err){
//         console.log(err)
//     }
//     console.log(result);
// })
// change(1234,4567,5,function(err,result){
//    if(err){
//        console.log(err);
//    }
//    if(result)
//    console.log(result);
// });




















