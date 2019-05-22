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
    seal_price: {
        type: Number,
        required: true,
    },
    seal_count: {
        type: Number,
        required: true,
        default: 0,
    },
    month_seal_count: {
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
    is_mail: {
        type: Boolean,
        default: false,
    },
    posttage: {
        type: Number,
    },
    keyword: {
        type: Array,
    },
    sort: {
        type: String,
    },
});

const goods = mongo.model("goods", goodsSchema);

let add_goods = function (json, callback) {
    if (!json.name || !json.price || !json.seal_price) {
        return callback({
            error: "添加商品时",
            errCode: 999,
            describe: "数据缺失"
        });
    };
    new_gid(function (err, gid) {
        if (err) {
            return callback(err);
        };
        let obj = {
            gid: gid,
            price: json.price,
            name: json.name,
            seal_price:json.price,
        };
        if (json.descript) {
            obj.descript = json.describe;
        };
        if (typeOf(json.is_mail) != "undefind") {
            obj.describe = json.describe;
        };
        if (json.posttage) {
            obj.posttage = json.describe;
        };
        if (json.keyword) {
            obj.keyword = json.keyword;
        };
        if (sort) {
            obj.
        };
        
    });
    
};

function new_gid(callback) {
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
