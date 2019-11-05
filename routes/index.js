const router = require('koa-router')();
const DB = require('../module/db');
const tools = require('../module/tools');
const url = require('url');

router.use(async (ctx,next)=>{
    let navList = await DB.find('nav',{},{},{sort:{"status":1}});
    let pathname = url.parse(ctx.request.url).pathname;
    ctx.state.navList = navList;
    ctx.state.pathname = pathname
    await next();
})

router.get('/content/:id',async (ctx)=>{
    let id = ctx.params.id
    let content = await DB.find('article',{_id: DB.getObjectID(id)})
    console.log(content);
    await ctx.render('default/content',{pageInfo:content[0]})
})

router.get('/',async (ctx)=>{
    let forcusList = await DB.find('forcus',{},{},{sort:{"sort":1}})
    await ctx.render('default/index',{forcusList})
})
router.get('/about',async (ctx)=>{
    await ctx.render('default/about',{url:'about'})
})
router.get('/case',async (ctx)=>{
    await ctx.render('default/case')
})
router.get('/connect',async (ctx)=>{
    await ctx.render('default/connect')
})
router.get('/news',async (ctx)=>{
    await ctx.render('default/news')
})
router.get('/service',async (ctx)=>{
    let findResult = await DB.find('article',{pid:"5da53449c6d6e2a283714983"},{_id:1,title:1,img_url:1});
    await ctx.render('default/service',{list:findResult})
})
 
module.exports = router.routes();