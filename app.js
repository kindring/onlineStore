const ht=require('./storeServer.js');
const path=require('path');
const router=require('./router/router.js');
ht.use('/imgs', path.join(__dirname,'./views/imgs/'));
ht.use('/css', path.join(__dirname,'./views/css/'));
ht.use('/js', path.join(__dirname,'./views/js/'));
ht.listen(80,function(){
   console.log('server is runing');
});

