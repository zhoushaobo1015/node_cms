const router = require('koa-router')();
const DB = require('../../module/db');
const tools = require('../../module/tools');

router.get('/', async (ctx)=>{
    let result = await DB.find('articlecate',{});
    await ctx.render('admin/article_cate/list',{list:tools.cateToList(result)})
})

router.get('/add', async (ctx)=>{
    let result = await DB.find('articlecate',{"pid":"0"});
    await ctx.render('admin/article_cate/add',{catelist:result});
})

router.post('/doAdd', async (ctx)=>{
    let title = ctx.request.body.title;
    let pid = ctx.request.body.pid;
    let keywords = ctx.request.body.keywords;
    let status = Number( ctx.request.body.status );
    let description = ctx.request.body.description; 
    let add_time = String( new Date() );
    let findResult = await DB.find('articlecate',{title});
    if(findResult.length>0){
        ctx.render('admin/error',{
            message:'该团队已经存在',
            redirect: ctx.state.__HOST__+'/admin/article_cate/add'
        });
    }else{
        try{
            let insertResult = await DB.insert('articlecate',{title, pid, keywords, status, description, add_time});
            if(insertResult.result.ok){
                ctx.render('admin/error',{
                    message:'添加成功 ：）',
                    redirect: ctx.state.__HOST__+'/admin/article_cate/'
                });
            }else{
                ctx.render('admin/error',{
                    message:'添加失败~。~!!!',
                    redirect: ctx.state.__HOST__+'/admin/article_cate/add'
                });
            }
        }
        catch(err){
            ctx.render('admin/error',{
                message:"添加失败~。~!!!",
                redirect: ctx.state.__HOST__+'/admin/article_cate/add'
            });
        }
    }
})

module.exports = router.routes();