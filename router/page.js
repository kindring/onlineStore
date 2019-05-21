const ht=require('../storeServer.js');
ht.get('/',function(req,res){
    console.log('主页');
    res.render('store.html');
    // res.end()
});
ht.get('/login',function(req,res){
    res.render('login.html')
});