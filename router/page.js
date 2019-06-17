const ht=require('../storeServer.js');
const art=require('art-template');
ht.get('/',function(req,res){
    console.log('主页');
    res.art('index.html',{
        herf:ht.a_herf
    },art.render)
    // res.end()
});
ht.get('/login',function(req,res){
    res.render('login.html');
});

ht.get('/admin_log',function(req,res){
    console.log("登录页面-----");
    console.log(req.pathname);
    res.render('admin_login.html');
});




