const mongo = require('mongoose');
const Schema = mongo.Schema;

let error_obj = {
    error: null,
    errCode: null,
    describe:null,
}
mongo.connect('mongodb://localhost/itcast', { useNewUrlParser: true });

const goodsSchema = new Schema({
    gid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sell_price: {
        type: Number,
        required: true,
    },
    sell_count: {
        type: Number,
        required: true,
        default: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    descript: {
        type: String,
    },
    car_count: {
        type: Number,
        default: 0,
    },
    postage: {
        type: Number,
        default:0,
    },
    keyword: {
        type: String,
    },
    sort: {
        type: String,
    },
});

const goods = mongo.model("goods", goodsSchema);

let add_goods = function (json, callback) {
    if (!json.name || !json.price || !json.sell_price) {
        return callback({
            error: "添加商品时",
            errCode: 999,
            describe: "数据缺失"
        });
    };
    new_gid(function (err, gid) {
        if (err) {
            return callback(err);
        }
        let obj=create_sql(json);
        console.log("------");
        console.log(obj);
        obj.gid=gid;
        let newGoods = new goods(obj);
        newGoods.save(function (err, result) {
            if (err) {
                return callback({
                    error: err,
                    describe: "添加商品时出现了错误",
                    errCode: 555,
                });
            }
            callback(null,result);
        })
    });
    
};

let change = function (json,callback) {
    if (!json.gid) {
        return callback({
            error: "修改数据时",
            describe: "修改数据的第一个参数必须是含有商品id的json",
            errCode:999,
        });
    }
    let obj = create_sql(json);
    goods.updateOne({ gid: json.gid }, obj, function (err,result) {
        if (err) {
            return callback({
                error: err,
                describe: "更新数据出现错误",
                errCode: 555,
            });
        }
        callback(null, result);
    })
};

let find = function (json,callback) {
    goods.find(json, function (err, result) {
        if (err) {
            return callback({
                error:err,
                describe: "查找失败出现错误",
                errCode:555,
            })
        }
        return callback(null,result)
    })
};

function create_sql(json) {
    let obj = {
        price: json.price,
        name: json.name,
        seal_price: json.price,
    };
    if (json.price) {
        obj.price = json.price;
    };
    if (json.name) {
        obj.name=json.name;
    };
    if (json.sell_price) {
        obj.sell_price=json.sell_price
    };
    if (json.descript) {
        obj.descript = json.descript;
    };
    if (json.postage) {
        obj.postage = json.postage;
    };
    if (json.keyword) {
        obj.keyword = json.keyword;
    };
    if (json.sort) {
        obj.sort = json.sort;
    };
    if(json.stock){
        obj.stock=json.stock;
    };
    if (!json.price || !json.name || !json.sell_price) {
        obj.err = "数据缺失,应当拒绝操作";
    }
    return obj;
};
function generate() {
    //生成随机令牌
    let x1 = parseInt(Math.random() * 9);
    let x2 = parseInt(Math.random() * 7);
    let x3 = parseInt(Math.random() * 8);
    let x4 = parseInt(Math.random() * 7);
    let x5 = parseInt(Math.random() * 6);
    let x6 = parseInt(Math.random() * 6);
    let x7 = parseInt(Math.random() * 6);
    let x8 = parseInt(Math.random() * 6);
    let x9 = parseInt(Math.random() * 6);
    return `${x1}${x2}${x3}${x4}${x5}${x6}${x7}${x8}${x9}`;
};
function new_gid(callback) {
    let gid = generate();
    goods.findOne({ gid: gid }, function (err, ter) {
        if (err) {
            return callback({
                errCode: 555,
                describe: "在创建新gid时出现异常",
                error:err,
            })
        }
        if (!ter) {
            callback(null,gid);
        } else {
            new_gid(callback);
        }
        
    })
}

exports.add = add_goods;
exports.update = change;

//测试完成,可进行条件分页查询,第一个参数是跳过前面几个
exports.find=function(condition,skipNum,limitNum,natural,callback){
    var query=goods.find({});
    if(condition){
        query.where(condition);
    }
    query.skip(skipNum);
    if(natural!==null){
        query.sort({$natural:-1});
    }//查找顺序
    query.limit(limitNum);
    query.exec(function(err,docs){
        callback(err,docs);
    })
};

exports.findOne=function(gid,callback){
    goods.findOne({gid:gid},function(err,result){
        if(err){
            return callback(err);
        }
        return callback(null,result);
    })
};

// //模糊查询最新的数据
let str="想";
let reg=RegExp(str);
//模糊分页条件查询
// exports.find(null,0,10,-1,function(err,docs){
//     if(err){
//         return console.log(err);
//     }
//     console.log(docs);
// });

