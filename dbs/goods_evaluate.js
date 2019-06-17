const mongo = requrie('mongoose');
const Sechem = mongo.Schema;
const evaluateSchema = new Schema({
	gid:{
	    type: String,
	    required:true,
	},
	pid:{
	    type: String,
	    required:true,
	},
	content:{
		type: String,
		required:true,
    },
    date: {
        type: Date,
        required:true,
    },
    star: {
        type: Number,
        required:true,
    },
});

const evaluate = mongo.model("evaluate", evaluateSchema);

let add = function (json, callback) {
    if (!json.gid || !json.pid || !json.content || !json.star||!json.date) {
        return callback({
            error: "数据缺失",
            describe: "添加评论必须要有商品id和用户id已经星级和评论内容",
            errCode:999,
        })
    };
    let newMsg = new evaluate({
        gid: json.gid,
        pid: json.pid,
        content: json.content,
        date: json.date,
        star:json.star,
    });
    newMsg.save(function (err, result) {
        if (err) {
            return callback({
                error: err,
                describe: "保存评论失败,未定义错误",
                errCode: 555,
            });
        };
        return callback(null,result);
    });
};

let change = function (json, callback) {
    if (!json.gid || !json.pid || !json.content || !json.star || !json.date) {
        return callback({
            error: "数据缺失",
            describe: "修改评论必须要有商品id和用户id已经星级和评论内容",
            errCode: 999,
        })
    };
    evaluate.updateOne({
        gid: json.gid,
        pid: json.pid
    }, {
            content: json.content,
            star: json.star,
            date: json.date
        }), function (err, result) {
            if (err) {
                return callback({
                    error: err,
                    describe: "更新评论失败,出现错误",
                    errCode: 555,
                });
            };
            return callback(null, result);
        };
};

let find = function (json, callback) {
    evaluate.find(json, function (err,result) {
        if (err) {
            return callback({
                error: err,
                describe: "查询评论失败,服务器错误",
                errCode: 555,
            });
        };
        return callback(null, result);
    })
};

let del = function (gid, pid, callback) {
    evaluate.remove({ pid: pid, gid: gid }, function (err, result) {
        if (err) {
            return callback({
                error: err,
                describe: "删除评论失败,未捕获的错误",
                errCode: 555,
            });
        };
        callback(null, result);
    })

};

exports.add = add;
exports.change = change;
exports.find = find;
exports.del = del;

