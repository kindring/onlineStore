const fs=require('fs');
const path=require('path');
const mime=require('../mime.json');//导入mime表
let staticUse=[];
// let rs=fs.createReadStream('./tmp/a/apple/a.txt');

function resFileBuffer(res,filepath,options){

}
exports.resFile=function(res,pathname,extname){
    let extmime=mime[extname]||'text/plain';
    //console.log(extmime);
    res.writeHead(200, {'Content-Type':extmime});
    for(let i=0;i<staticUse.length;i++){
        if(pathname.indexOf(staticUse[i].rQ)!==-1){
            console.log("当前需要获取的文件属于开放的静态资源");
            let pt=pathname.split(staticUse[i].rQ);
            pt=pt[pt.length-1];
            let str=path.join(staticUse[i].fP,pt);
            console.log(str);
            let rs=fs.createReadStream(str);
                rs.on('data',function(chunk){
                    res.write(chunk);
                });
                rs.on('end',function(){
                    res.end();
                })
        }
        // if(pathname.indexOf(staticUse[i].rQ)!=-1){
        //     let fp='/'+staticUse[i].fP;
        //     let rf1=pathname.replace(staticUse[i].rQ,staticUse[i].fP);
        //     let str=path.join(rf1);
        //     console.log(str);
        //     let rs=fs.createReadStream(str);
        //     rs.on('data',function(chunk){
        //         res.write(chunk);
        //     });
        //     rs.on('end',function(){
        //         //console.log(str+'数据发送完毕');
        //         res.end();
        //     });
        // }
    }
};
exports.staticUse=staticUse;