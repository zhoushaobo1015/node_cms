/**
 * Created by Administrator on 2018/3/20 0020.
 */
const router = require('koa-router')();
const DB = require('../../module/db');

router.get('/',async (ctx)=>{
    ctx.render('admin/index');
})

router.get('/changeStatus', async (ctx) =>{
    let collectionName=ctx.query.collectionName;
    let attr=ctx.query.attr;
    let id=ctx.query.id;
    let json1 = null;
    // 先去查询数据库该数据状态
    let findResult = await DB.find(collectionName,{_id:DB.getObjectID(id)});
    if( findResult.length > 0 ){
        if(findResult[0][attr]){
            json1 = {
                [attr]: 0
            }
        }else{
            json1 = {
                [attr]: 1
            }
        }
    }
    // 修改该用户状态
    let updateResult = await DB.update(collectionName,{"_id":DB.getObjectID(id)},json1);
    if(updateResult.result.ok){
        ctx.body = {"status":200,data:{"message":"ok"}}
    }else{
        ctx.body = {"status":10001,data:{"message":"error"}}
    }
})

// 修改status状态
router.post('/changeSort', async (ctx) =>{

    let value = ctx.request.body.value;
    let collectionName = ctx.request.body.collectionName;
    let id = ctx.request.body.id;
    let attr = ctx.request.body.attr;

    let findResult = await DB.find(collectionName,{_id:DB.getObjectID(id)});
    if(findResult.length > 0){
        let updateResult = await DB.update(collectionName,{_id:DB.getObjectID(id)},{[attr]:value})
        if(updateResult.result.ok){
            ctx.body = {"status":200,data:{"message":"ok"}}
        }else{
            ctx.body = {"status":10002,data:{"message":"update error"}}
        }
    }else{
        ctx.body = {"status":10001,data:{"message":"no find"}}
    }

})

router.get('/removeInfo', async ( ctx )=>{
    let id = ctx.query.id;
    let collectionName = ctx.query.collection;
    let url = ctx.query.url;
    try{
        let result = await DB.remove(collectionName,{_id: DB.getObjectID(id) });
        if(result.result.ok) {
            ctx.redirect(ctx.state.G.prevPage);
        }else{
            ctx.render('admin/error',{
                message:"删除失败~。~!!!",
                redirect: ctx.state.__HOST__+url
            });
        }
    }catch(err){
        ctx.render('admin/error',{
            message:"删除失败~。~!!!",
            redirect: ctx.state.__HOST__+url
        });
    }
})

module.exports=router.routes();