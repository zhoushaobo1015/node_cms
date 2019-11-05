let MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
let Config = require('./config');

class DB {

    // 单例： 实现多次实例化且数据可以共享
    static getInstance(){
        if(!DB.instance){
            DB.instance = new DB();
        }
        return DB.instance;
    }

    constructor(){
        this.dbClient = null;
        this.connect();
    }
    connect(){
        return new Promise((resolve,reject)=>{
            if(!this.dbClient){ /* 解决数据库多次连接问题 */
                MongoClient.connect(Config.dbUrl,(err,client)=>{
                    if(err){
                        reject(err);
                        return false;
                    }else{
                        this.dbClient = client.db(Config.dbName);
                        resolve(this.dbClient);
                    };
                });
            }else{
                resolve(this.dbClient);
            };
        });
    }
    /**
     * 老板查询展示所有数据
     * */ 
    // find_sort(collectionName,json){
    //     return new Promise((resolve,reject)=>{
    //         this.connect().then(db=>{
    //             let result = db.collection(collectionName).find(json).sort({create_time:-1})
    //             result.toArray((err,docs)=>{
    //                 if(err){
    //                     reject(err);
    //                     return false;
    //                 }else{
    //                     resolve(docs);
    //                 };
    //             });
    //         });
    //     });
    // }
    /**
     * 分页查询 参数如下
     * 1. 那张表
     * 2. 查询具体内容
     * 3. 查询那个字段
     * 4. 分页数和当前页面 如：{page:1,limit:20}
     * */ 
    find(collectionName,json,json2,json3){
        let attr = {},
        slipNum = 0,
        page = 0,
        pageSize = 0,
        sortJson = {};
        switch (arguments.length) {
            case 2:
                break;
            case 3:
                attr = json2;
                break;
            case 4:
                attr = json2;
                page = json3.page || 1;
                pageSize = json3.limit || 20;
                slipNum = (page-1)*pageSize;
                if(json3.sort){
                    sortJson = json3.sort
                }
                break;
            default:
                console.log("参数错误");
                break;
        }
        return new Promise((resolve,reject)=>{
            this.connect().then(db=>{
                let result = db.collection(collectionName).find(json,{fields:attr}).skip(slipNum).limit(pageSize).sort(sortJson);
                result.toArray((err,docs)=>{
                    if(err){
                        reject(err);
                        return false;
                    }else{
                        resolve(docs);
                    };
                });
            });
        });
    }
    update(collectionName,json,json2){
        return new Promise((resolve,reject)=>{
            this.connect()
            .then((db)=>{
                db.collection(collectionName).updateOne(json,{$set:json2},(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            });
        });
    }
    insert(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect()
            .then((db)=>{
                db.collection(collectionName).insertOne(json,(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    };
                });
            });
        });
    }
    remove(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect()
            .then(db=>{
                db.collection(collectionName).removeOne(json,(err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            })
        })
    }
    getObjectID(id) {
        return new ObjectID(id);
    }
    // 统计某张表的总条数
    count(collectionName,json){
        return new Promise((resolve,reject)=>{
            this.connect()
            .then((db)=>{
                db.collection(collectionName).count(json)
                .then(count=>{
                    resolve(count);
                });
            });
        });
    }
}

// let myDB = DB.getInstance();
// console.time("start");
// myDB.find('user',{}).then((data)=>{
//     // console.log(data,"data");
//     console.timeEnd("start");
// })

// let myDB1 = DB.getInstance();
// console.time("start1");
// myDB1.find('user',{}).then((data)=>{
//     // console.log(data,"data");
//     console.timeEnd("start1");
// })

module.exports = DB.getInstance();