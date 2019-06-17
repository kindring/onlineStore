const ht=require('../storeServer.js');
const art=require("art-template");
const formidable=require('formidable');
const mime=require('../mime.json');

const goods=require('../dbs/goods.js');
ht.post('/admin_login',function(req,res){
   console.log("管理员登录");
   ht.parseBody(req,function(body){
       if(!ht.isJSON(body)){
          return res.json({
               errCode:110,
               describe:"数据错误,非法传输的数据",
               error:"广告招租"
           })
       }
       body=JSON.parse(body);
       if(!body.user||!body.password){
           return res.err({
               errCode:999,
               describe:"数据缺失,拒绝操作",
               error:"广告位招租"
           })
       }
       if(body.user=="root"&&body.password==ht.admin_password){
           res.writeHead(200,{
               'Set-Cookie': ['pas='+ht.admin_password,'HttpOnly']
           });
           res.end(JSON.stringify({
               code:"200",
               describe:"登录成功,跳转至管理页面",
           }))
       }else{
           res.err({
               errCode:404,
               describe:"用户名或者密码错误,密码联系管理员",
               error:"账号密码错误"
           })
       }
   })
});

ht.get('/admin',function(req,res){
    console.log("管理页面");
    let cookie=ht.parseCookie(req);
    console.log(cookie.pas);
    if(cookie.pas!=ht.admin_password){
        console.log("匹配失败,无权限访问");
        res.writeHead(302, {'Location': '/admin_log'});
        return res.end();
    }//合法性验证
    console.log("主页");
    res.render('admin/index.html')
});

ht.get('/goods_add',function(req,res){
   let cookie=ht.parseCookie(req);
   if(cookie.pas!=ht.admin_password){
        res.writeHead(302, {'Location': '/admin_log'});
       return res.end();
   }
   res.render('admin/goods_add.html');
});

ht.get('/goods_lists',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        res.writeHead(302, {'Location': '/admin_log'});
        return res.end();
    }

    res.render('admin/goods_list.html');
});
ht.get('/i_carousel',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        res.writeHead(302, {'Location': '/admin_log'});
        return res.end();
    }
    res.render('admin/index_carousel.html');
});
ht.get('/i_carousel',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        res.writeHead(302, {'Location': '/admin_log'});
        return res.end();
    }
    res.render('admin/index_carousel.html');
});
ht.get('/i_hot',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        res.writeHead(302, {'Location': '/admin_log'});
        return res.end();
    }
    res.render('admin/index_hot.html');
});

ht.get('/goods_list',function(req,res){

    let query=req.Pquery;
    console.log(query.sort);
    let reg=null;
    let natural=null;
    let condition=null;
    if(query.sort){
        if(query.sort!=0){
            console.log('设置查找属性');
            condition={
                sort:query.sort,
            };
        }
    }
    if(query.keyword){
        console.log(condition);
        if(query.sort==0){
            condition={
                name:{$regex:reg}
            }
        }else{
            condition={
                sort:query.sort,
                name:{$regex:reg}
            };
            console.log(condition)
        }
    }
    if(query.postage){
        condition.postage=query.postage
    }
    if(query.rear){
        natural=-1;//如果有这么一个东西则是从后方排序查找
    }
    let skip=(query.page-1)*query.limit;
    let limit=parseInt(query.limit);
    console.log(`page:${query.page}skip:${skip}\nlimit:${limit}`);
    console.log(condition);
    goods.find_goods(condition,skip,limit,natural,function(err,result){
        if(err){
            console.log("--------查找商品+++出现错误-------");
            console.log(err);
            return res.end();
        }
        for(let i = 0 ;i<result.length;i++){
            result[i]=JSON.stringify(result[i]);
        }
        result=result.join('*-*');
        res.end(result)
    })

});

ht.get('/goods_cover',function(req,res){
    let query=req.Pquery;
    goods.find_cover(query.gid,function(err,result){
        if(err){
            console.log(err);
            return res.err(err);
        }
        if(!result){
            return res.end();
        }
        res.writeHead(200,{
            "content-Type":result.type,
        });
        res.end(result.file);
    });
});

ht.get('/goods_edit',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        res.writeHead(302, {'Location': '/admin_log'});
        return res.end();
    }
    let query=req.Pquery;
    if(!query.gid){
        res.writeHead(302, {'Location': '/admin'});
        return res.end();
    }

    console.log("商品页面");
    goods.find_goods_one(query.gid,function(err,result){
        if(err){
            return res.end(err.message);
        }
        if(!result){
            return res.end('404 not find page');
        }
        res.art('admin/goods_editor.html',{
            goods:result,
        },art.render);
    });
});

ht.get('/commodity',function(req,res){
    let query=req.Pquery;
    if(!query.gid){
        return res.end('404 没有找到该商品');
    }
    goods.find_goods_one(query.gid,function(err,result){
        if(err){
            console.log(err);
            return res.err(err);
        }
        if(!result){
            return res.end('404 没有找到该商品');
        }
        res.art('commodity.html',{goods:result},art.render);
    })
});
ht.get('/search',function(req,res){
   let query=req.Pquery;
   let reg=null;
   let condition=null;
   let natural=-1;
   if(query.sort){
       if(query.sort!=0){
           console.log('设置查找属性');
           condition={
               sort:query.sort,
           };
       }
   }
   if(query.keyword){
       reg=RegExp(query.keyword);
        console.log('condition------------');
       console.log(condition);
       if(query.sort==0){
           condition={
               name:{$regex:reg}
           }
       }else{
           condition={
               sort:query.sort,
               name:{$regex:reg}
           };
           console.log(condition)
       }
    }
    let skip=0;
    let limit=20;
    console.log('condition-------------------------');
    console.log(condition);
    goods.find_goods(condition,skip,limit,natural,function(err,result){
        if(err){
            console.log("--------查找商品-------");
            console.log(err);
            return res.err(err);
        }
        let keyword=query.keyword||'';
        let sort=query.sort||0;

        res.art('search.html',{
            search:{
              sort:sort,
              keyword:keyword
            },
            goods:result,
        },art.render);
    })
});

ht.post('/goods_add',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        return res.end(JSON.stringify({
            error:"管理员口令失效",
            describe:"密码失效",
            errCode:255,
        }))
    };
    ht.parseBody(req,function(body){
        if(!ht.isJSON(body)){
           return res.err({
               error:"非法格式",
               describe:"数据格式对接错误",
               errCode:999
           })
        }
        body=JSON.parse(body);
        goods.add_goods(body,function(err,result){
            if(err){
                console.log("----err-9---");
                console.log(err);
                return res.err(err);
            }
            console.log('---result---');
            console.log(result);
            res.json(result);
            })
    })
});
ht.post('/cover_add',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        return res.err({
            errCode:110,
            describe:"当前用户无权限,请刷新页面",
            error:"添加封面"
        })
    }

    let form = new formidable.IncomingForm();
    form.uploadDir='tmp/';
    form.type=true;
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return res.err(err);
        }
        if(!fields.gid||!files.file){
            return res.err({
                errCode:999,
                describe:"必须要有gid和文件",
                error:"封面上传"
            })
        }
        let fileName,filePath,Ctype;
        if(files.file){
            fileName=files.file.name;
            filePath=files.file.path;
            Ctype=files.file.type;
        }
        let obj={
            gid:fields.gid,
            filePath:filePath,
           type:Ctype,
        };
        goods.add_cover(obj,function(err,result){
            if(err){
                return res.err(err)
            }
            console.log(result);
            res.json({
                code:200,
                describe:"ok"
            });
        })
    })

});

ht.post('/edit_goods',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        return res.err({
            errCode:110,
            describe:"当前用户无权限,请刷新页面",
            error:"添加封面"
        })
    };

    ht.parseBody(req,function(body){
        if(!ht.isJSON(body)){
            return res.err({
                error:"非法格式",
                describe:"数据格式对接错误",
                errCode:999
            })
        }
        body=JSON.parse(body);
        goods.change_goods(body,function(err,result){
            if(err){
                console.log("----err-9---");
                console.log(err);
                return res.err(err);
            }
            console.log('---result---');
            console.log(result);
            res.json(result);
        })
    })
});

ht.post('/edit_carousel',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        return res.err({
            errCode:110,
            describe:"当前用户无权限,请刷新页面",
            error:"添加封面"
        })
    };
    let form = new formidable.IncomingForm();
    form.uploadDir='tmp/';
    form.type=true;
    form.parse(req,function(err,fields,files){
        if(err){
            console.log(err);
            return res.err(err);
        }
        if(!fields.gid){
            return res.err({
                errCode:999,
                describe:"必须要有gid",
                error:"封面上传"
            })
        }
        if(!files.file&&!fields.a_href){
            return res.err({
                descript:"失败,此请求无意义.无可更改的数据",
                errCode:999,
                error:"招租"
            })
        }
        let fileName,filePath,Ctype;
        if(files.file){
            fileName=files.file.name;
            filePath=files.file.path;
            Ctype=files.file.type;
            let obj={
                gid:fields.gid,
                filePath:filePath,
                type:Ctype,
            };
            goods.add_cover(obj,function(err,result){
                if(err){
                    return res.err(err)
                }
                console.log(result);
                res.json({
                    code:200,
                    describe:"ok"
                });
            });
        }
        if(fields.a_href){
            ht.a_herf[fields.gid]=fields.a_href;
            ht.save_a();
        }
        if(!files.file&&fields.a_href){
            res.end('链接数据正在保存中');
        }
    });
});
ht.post('/edit_hots',function(req,res){
    let cookie=ht.parseCookie(req);
    if(cookie.pas!=ht.admin_password){
        return res.err({
            errCode:110,
            describe:"当前用户无权限,请刷新页面",
            error:"添加封面"
        })
    };
    let form = new formidable.IncomingForm();
    form.uploadDir='tmp/';
    form.type=true;
    form.parse(req,function(err,fields,files){
        console.log("解析请求");
        if(err){
            console.log(err.message);
            return res.end(err.message);
        }
        if(!fields.gid){
            return res.err({
                errCode:999,
                describe:"该请求必须要有gid数据",
                error:"god like holy shit"
            })
        }
        if(!files.file&&!fields.a_href){
            console.log('--------');
            return res.err({
                descript:"失败,此请求无意义.无可更改的数据",
                errCode:999,
                error:"招租"
            })
        }
        let fileName,filePath,Ctype;
        if(files.file){
            fileName=files.file.name;
            filePath=files.file.path;
            Ctype=files.file.type;
            let obj={
                gid:fields.gid,
                filePath:filePath,
                type:Ctype,
            };
            goods.add_cover(obj,function(err,result){
                if(err){
                    return res.err(err)
                }
                console.log(result);
                res.json({
                    code:200,
                    describe:"ok"
                });
            });
        }
        if(fields.a_href){
            ht.a_herf[fields.gid]=fields.a_href;
            ht.save_a();
        }
        if(!files.file&&fields.a_href){
            res.end('链接数据正在保存中');
        }
    });
});

