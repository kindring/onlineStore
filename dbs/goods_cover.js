const mongo = require('mongoose');
const Schema = mongo.Schema;

const fs = require('fs');

mongo.connect('mongodb://localhost/itcast', { useNewUrlParser: true });

const coverSchema = new Schema({
    gid: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required:true,
    },
    file: {
        type: Buffer,
        required: true,
    },
});
const cover = mongo.model("goods_cover", coverSchema);
let add = function (gid, json, callback) {
    if (!json.file || !json.type) {
        return callback({
            describe: "添加封面必须要有文件和type类型",
            errCode: 999,
            error: "自定义错误",
        });
    };
    let obj = {
        gid: gid,
        type: json.type,
        file: json.file,
    };
    let newCover = new cover(obj);
    newCover.save(function (err, result) {
        if (err) {
            return callback({
                error: err,
                describe: "保存封面时出现错误",
                errCode: 555,
            });
        };
        return callback(null, {
            gid: result.gid,
            type: result.type,
        })

    });
};

let find = function (gid, callback) {
    cover.findOne({ gid: gid }, function (err, result) {
        if (err) {
            return callback({
                error: err,
                describe: "查询封面失败",
                errCode: 405,
            });
        };
        return callback(null, result);
    })
};

let change = function (json,callback) {
    if (!json.gid || !json.file || !json.type) {
        return callback({
            error: "数据缺失",
            describe: "修改封面时出现错误",
            errCode: 999,
        });
    };
    cover.updateOne({ gid: json.gid }, {
        gid: json.gid,
        file: json.file,
        type: json.type,
    }, function (err, result) {
        if (err) {
            return callback({
                error: err,
                describe: "更新封面失败",
                errCode: 555,
            });
            };

        return callback(null, result);
    });
};

function initialization() {
    //初始化默认图片

    //目前没有图片
};
exports.find=find;

exports.add=add;

exports.change=change;