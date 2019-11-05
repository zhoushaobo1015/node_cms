/**
 * Created by Administrator on 2018/3/21 0021.
 */
var md5 = require('md5');
const multer = require('koa-multer');
const DB = require('./db');
let tools={
    md5(str){
        return md5(str)
    },
    cateToList(list){
        let arr = [];
        list.forEach(element => {
            if(element.pid === "0"){
                arr.push(element);
            }
        });
        arr.forEach(data=>{
            data.list = [];
            list.forEach(element => {
                if(data._id == element.pid){
                    data.list.push(element);
                }
            });
        });
        return arr
    },
    multer(){
        // 配置koa-multer
        var storage = multer.diskStorage({
            //文件保存路径
            destination: function (req, file, cb) {
                cb(null, 'public/upload/image/');
            },
            //修改文件名称
            filename: function (req, file, cb) {
            //注意路径必须存在
            var fileFormat = (file.originalname).split(".");
            cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]); }
        })

        //加载配置
        var upload = multer({ storage: storage })
        return upload;
    }
}

module.exports=tools;