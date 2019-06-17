const cover = require('./goods_cover.js');
const goods = require('./goods_db.js');
const fs = require('fs');

let add_goods = function (json, callback) {
    //添加商品任务
    //判断是否有必要的值
    if (!json.name || !json.price || !json.sell_price) {
        return callback({
            error:"数据缺失",
            describe:"添加商品必须要有商品的进价与售价",
            errCode:"999",
        });
    }
    //进行数据处理
    goods.add(json,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null,result);
    })
};

//添加封面任务
let add_cover = function (json, callback) {
    if(!json.gid||!json.file||!json.type){
        return callback({
            errCode:999,
            describe:"商品封面必须要有商品id,和文件,以及类型",
            error:"数据缺失"
        })
    }
    cover.add(json,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null,result);
    })
};

//更新商品数据,此方法可同时更改商品详情
let update_goods = function (json,callback){
    if(!json.gid){
        return callback({
            errCode:999,
            describe:"更新商品数据必须要有id",
            error:"数据缺失,更新商品",
        })
    }
    goods.update(json,function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null,result);
    })
};

//更新封面
let update_cover = function (json,callback){
  if(!json.file||!json.gid||!json.type){
      return callback({
          errCode:999,
          describe:"封面内容缺失",
          error:"更新失败"
      })
  }
};

//获取封面数据
let find_cover = cover.find;

exports.add_goods=add_goods;
exports.add_cover=function(json,callback){
    if(!json.filePath||!json.type||!json.gid){
        return callback({
            errCode:999,
            describe:"数据缺失",
            error:"添加封面"
        });
    }
    cover.find(json.gid,function(err,result){
        if(err){
            return callback(err);
        }
        fs.readFile(json.filePath,function(error,data){
            if(error){
                console.log(error);
                return callback(error)
            }
            console.log(data);
            if(result){
                cover.change({
                    gid:json.gid,
                    file:data,
                    type:json.type,
                },function(change_error,change_result){
                    if(change_error){
                        return callback(change_error);
                    }
                    console.log('修改文件');
                    console.log(change_result);
                    return callback(null,change_result)
                })
            }else{
                console.log("没有此文件,进行增加");
                cover.add(json.gid,{
                    file:data,
                    type:json.type,
                },function(add_err,add_result){
                    if(add_err){
                        return callback(add_err);
                    }
                    return callback(null,add_result);
                })
            }
        })
    })
};

exports.change_goods=update_goods;
exports.find_goods=goods.find;//查询商品
exports.find_cover=cover.find;//查询封面

exports.find_goods_one=goods.findOne;


