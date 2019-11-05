const router = require('koa-router')();

router.get('/',async (ctx)=>{
    console.log(
        ctx.query
    )
    ctx.body = {"message":"更新成功","success":true,"status":200}
})
 
module.exports = router.routes();