const ht=require('../storeServer.js');
const user_db=require('../dbs/user');
const art=require("art-template");
const formidable=require('formidable');
const mime=require('../mime.json');
ht.post('/register',function(req,res){
    parseBody(req,function(body){
        body=JSON.parse(body);
        user_db.add_user(body,function(err,result){
            if(err){
                return res.end(JSON.stringify(err));
            }
            console.log(result);
            res.end(JSON.stringify({
                pid:result.pid,
                name:result.name,
            }))
        })
    });
});
ht.post('/login',function(req,res){
    console.log("登录");
    parseBody(req,function(body){
        console.log("--用户尝试登录--");
        console.log('---***---');
        if(isJSON(body)){
            user_db.login(JSON.parse(body),function(err,data){
                if(err){
                    console.log(err);
                    return res.err(err);
                }
                console.log("--登录结果--");
                console.log(data);
                console.log("--***--");
                res.writeHead(200,{
                    'Set-Cookie': ['token='+data.token, 'email='+data.email,'id='+data.pid]
                });
                res.json(data);
            })
        }else{
            return res.err({
                errCode:110,
                describe:"错误,传输格式错误",
                error:"不知道是啥"
            })
        }

    });
});
ht.post('/log',function(req,res){
    parseBody(req,function(body){
        console.log(body);
        let cookie=parseCookie(req);
        console.log(`用户自动登录的cookie\n${cookie}\n结束`);
        console.log(cookie);
        console.log("-----------------");

        let user_obj={
            token:null,
            pid:null
        };
        if(isJSON(body)){
            body=JSON.parse(body);
            user_obj.token=body.token;
            user_obj.pid=body.pid;
        }else if(cookie.token){
            user_obj.token=cookie.token;
            user_obj.pid=cookie.pid;
        }else{
            console.log("无法自动登陆,无记录");
        }
        user_db.token_login(user_obj,function(err,data){
            if(err){
                console.log(err);
                return res.err(err)
            }
            console.log("autologin");
            console.log(data);
            let cookieStr="email="+data.email+",pid="+data.pid+",token="+data.token;
            console.log("用户设置的新cookie:"+cookieStr);
            res.writeHead(200,{
                'Set-Cookie': ['token='+data.token, 'email='+data.email,'id='+data.pid]
            });
            res.end(JSON.stringify(data));
        })
    })
});
ht.get('/logout',function(req,res){
    console.log("用户注销请求");
    let query=req.Pquery;
    let cookie=parseCookie(req);
    if(query===cookie.id){
        user_db.logout()
    }
});
ht.get(/user/,function(req,res){
    let cookie=parseCookie(req);
    let query=req.pathQuery;
    let pid=req.pathname.replace("/user/","");
    console.log(`query:${query}`);
    console.log(`pid:${pid}`);
    console.log(`cookie.token:${cookie.token}`);
    console.log(`cookie.pid:${cookie.id}`);
    if(cookie.token===query&&cookie.id===pid){
        user_db.describe({
            pid:pid,
            token:query,
        },function(err,data){
            console.log("个人中心验证完成");
            console.log(data);
            let user_obj={
                user:{
                    pid:data.pid,
                    token:cookie.token,
                    money:data.money||0,
                    name:data.name||"无法获取用户名",
                    payNum:data.payNum||0,
                    brief:data.brief,
                    notice_msg:data.notice_msg||data.brief||"天猫双十一"
                },

            };
            console.log(user_obj);
            res.art('user.html',user_obj,art.render);

        });
    }else{
    }
});
ht.get(/editor/,function(req,res){
    let cookie=parseCookie(req);
    let query=req.pathQuery;
    let pid=req.pathname.replace("/user/","");
    if(cookie.token===query&&cookie.id===pid){
        res.render('editor.html')
    }else{
    }
    res.render('editor.html')
});

ht.get('/header',function(req,res){
    let query=req.Pquery;
    user_db.find_head(query.pid,function(err,data){
        if(err){
           return res.err(err);
        }
        res.writeHead(200,{"Content-Type":data.type});
        res.end(data.file);
    })
});
ht.post('/upload',function(req,res){
    console.log("更新用户");
    let form = new formidable.IncomingForm();
    form.uploadDir='tmp/';
    form.type=true;
    let cookie=parseCookie(req);
    let query=req.pathQuery;
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return res.err(err);
        }
        let fileName,filePath,Ctype;
        if(files.file){
            fileName=files.file.name;
            filePath=files.file.path;
            Ctype=files.file.type;
        }
        let cookie=parseCookie(req);
        if(!cookie.token||!cookie.id){
            return res.err({
                describe:"错误,无法获取cookie数据",
                errCode:"110",
                error:"失败"
            })
        }
        let obj={
            token:cookie.token,
            pid:cookie.id,
            type:Ctype||null,
            path:filePath||null,
        };
        console.log(fields);
        if(fields.name){
            obj.user_name=fields.name;
        }
        if(fields.brief){
            obj.brief=fields.brief;
        }
        if(fields.birthday){
            obj.birthday=fields.birthday;
        }
        user_db.update(obj,function(err,data){
            if(err){
                console.log(err);
                return res.err(err);
            }
            res.end("ok");
        })
        //console.log(`name:${fileName}\npath:${filePath}\ntype:${Ctype}`);

    })
});

function parseCookie(req){
    let Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return Cookies;
}
function parseBody(req,callback){
    let body=[];
    let size=0;
    req.on("data",function(chunk){
        body.push(chunk);
        size+=chunk.length;
    });
    req.on("end",function(){
        body=Buffer.concat(body,size).toString();
        callback(body)
    })
}

function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(str.indexOf('{')>-1){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log(e);
            return false;
        }
    }
    return false;
}