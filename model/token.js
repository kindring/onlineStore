const fs=require('fs');
const path=require('path');

let tokenNumber=0;//口令数量
let max_token_num=20;//单组口令最大值
let tokens=[];//口令数组
let miss_arr=[];//用户注销后的口令数量下标数组
let error_obj={
    errCode:null,
    error:null,
    describe:null,
};
let token_path=path.join(__dirname,"tokens");
function loading(){
    return promise=new Promise(function(resolve,reject){
        fs.readdir(token_path,function(err,file){
            if(err){
                reject(err);
                throw err;
            }
            let num=0;
            if(file.length===num){
                resolve();
            }
            file.forEach(function(item){
                let pro=new Promise((res,rej)=>{
                    fs.readFile(path.join(token_path,item),function(err,data){
                        if(err){
                            reject(err);
                            throw err;
                        }
                        data=data.toString();
                        let index=item.split(".")[0];
                        data=data.split("-");
                        tokens[index]=data;
                            res();
                    })
                });
                pro.then((value)=>{
                    num++;
                    if(num===file.length){
                        resolve()
                    };
                },(err)=>{
                    throw err;
                })

            })

        })
    });
}
loading().then(()=>{
    console.log("tokens文件读取完成!");
    function generate(){
        //生成随机令牌
        let x1=parseInt(Math.random()*7);
        let x2=parseInt(Math.random()*7);
        let x3=parseInt(Math.random()*7);
        let x4=parseInt(Math.random()*7);
        let x5=parseInt(Math.random()*7);
        return `${x1}${x2}${x3}${x4}${x5}`;
    }
    function addGenerate(json){
        if(!json.email||!json.id){
            return console.log("数据缺失");
        }
        let obj={
            email:json.email,
            id:json.id,
            token:null,
            num:null,
        };
        obj.token=generate();
        obj.num=tokenNumber;
        let index=Math.floor(tokenNumber/max_token_num);
        let index2=Math.floor(tokenNumber%max_token_num);
        // console.log(`index=${index}\nindex2=${index2}`);
        if(!tokens[index]){
            console.log('值不存在 创建一组');
            tokens[index]=new Array(max_token_num);
        }
        //判断是否有之前被移除的口令
        if(miss_arr[0]){
            index=Math.floor( miss_arr[0]/max_token_num);
            index2=Math.floor( miss_arr[0]%max_token_num);
            obj.num=miss_arr[0];
            miss_arr.splice(0,1);
        }else{
            tokenNumber++;
        }
        tokens[index][index2]=JSON.stringify(obj);
        return obj;
    }//添加
    function getToken(num){
        let index=Math.floor(tokenNumber/max_token_num);
        let index2=Math.floor(tokenNumber%max_token_num);
        return JSON.parse(tokens[index][index2]);
    }//查询
    function remove(num){
        let index=Math.floor(num/max_token_num);
        let index2=Math.floor(num%max_token_num);
        miss_arr.push(JSON.parse(tokens[index][index2]).num);
        tokens[index][index2]=null;
    }//移除
    function save(num){
        let index=Math.floor(num/max_token_num);
        let str=tokens[index].join("-");
        let filePath=path.join(token_path,index+".txt");
        fs.writeFile(filePath,str,function(err){
            if(err){
                console.log("token口令保存失败了,请稍后继续尝试");
                return console.log(err);
            }
        })

    }
    exports.max_token_num=max_token_num;
    exports.addToken=addGenerate;//创建口令
    exports.getToken=getToken;//获取存储的口令
    exports.remove=remove;//移除指定口令
},(err)=>{
    throw err;
});





// for(let i =0;i< 35;i++){
//     let i2=i+1;
//     addGenerate({
//         email:`这是第${i2}个测试添加口令`,
//         id:i2,
//     });
// }
// save(1);
// save(21);






// function save(){
//     for(let i=0;i<tokens.length;i++){
//
//     }
//
// }

// for(let i =0;i< 35;i++){
//     let i2=i+1;
//     addGenerate({
//         email:`这是第${i2}个测试添加口令`,
//         id:i2,
//     });
// }
// remove(5);
// remove(6);
// remove(7);
// remove(8);
// remove(9);
// remove(10);
// for(let i =35;i< 70;i++){
//     let i2=i+1;
//     addGenerate({
//         email:`这是第${i2}口令`,
//         id:i2,
//     });
// }
// console.log(tokens);
