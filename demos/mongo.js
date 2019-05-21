const  mongo=require('mongoose');
const fs=require('fs');
const Schema=mongo.Schema;
//1连接数据库
mongo.connect('mongodb://localhost/itcast',{useNewUrlParser:true});

