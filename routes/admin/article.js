const router = require('koa-router')();
// const multer = require('koa-multer');
const DB = require('../../module/db');
const tools = require('../../module/tools');

// // 配置koa-multer
// var storage = multer.diskStorage({
//     //文件保存路径
//     destination: function (req, file, cb) {
//         cb(null, 'public/upload/image/');
//     },
//     //修改文件名称
//     filename: function (req, file, cb) {
//     //注意路径必须存在
//     var fileFormat = (file.originalname).split(".");
//     cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]); }
// })

// //加载配置
// var upload = multer({ storage: storage })


router.get('/', async (ctx)=>{
    // let result = await DB.find('admin',{"username":"admin1"},{"username":1},{page:1,limit:10})
    // let result = await DB.find('admin',{},{},{page:1,limit:10})
    let currentPage = ctx.query.page || 1;
    let limit = 5;  //配置分页数量
    let count = await DB.count('article',{});
    let result = await DB.find('article',{},{},{page:currentPage,limit:limit,sort:{"create_time":-1}})
    await ctx.render('admin/article/list', {totalPages: Math.ceil(count/limit), currentPage:currentPage,list:result});
})

router.get('/add', async (ctx)=>{
    let result = await DB.find('articlecate',{});
    ctx.render('admin/article/add',{classList: tools.cateToList(result)});
})
router.post('/doAdd', tools.multer().single('img_url'), async (ctx)=>{
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename;
    let title = ctx.req.body.title;
    let author = ctx.req.body.author;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description;
    let content = ctx.req.body.content;
    let status = Number(ctx.req.body.status);
    let create_time = new Date();
    let img_url = "";
    if(ctx.req.file){
        img_url = '/upload/image/' + ctx.req.file.filename;
    }
    let json = {
        pid,catename,title,author,is_best,is_hot,is_new,keywords,description,content,img_url,create_time, status
    }
    let result = await DB.insert('article',json);
    if(result.result.ok){
        ctx.redirect('/admin/article');
    }else{
        ctx.redirect('/admin/article/add');
    }
})

router.get('/remove', async (ctx) => {
    let collection = ctx.query.collection;
    let id = ctx.query.id;
    let url = ctx.query.url;

    if(!collection || !id || !url){
        ctx.redirect('/admin/article')
    }else{

        let result = await DB.remove(collection,{_id: DB.getObjectID(id)});
        if(result.result.ok){
            ctx.redirect(url);
        }else{
            ctx.render('admin/error',{
                message:'删除失败',
                redirect: ctx.state.__HOST__+'/admin/article'
            });
        }
    }
})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let findResult = await DB.find('article',{_id: DB.getObjectID(id)});
    if(findResult.length>0){
        let listResult = await DB.find('articlecate',{});
        await ctx.render('admin/article/edit',{cateInfo: findResult[0], classList: tools.cateToList(listResult), prevPage:ctx.state.G.prevPage});
    }else{
        ctx.render('admin/error',{
            message:'查找该新闻失败请重新选择~。~!!!',
            redirect: ctx.state.__HOST__+'/admin/article'
        });
    }
})

router.post('/doEdit', tools.multer().single('img_url'), async (ctx) => {
    let id = ctx.req.body.id;
    let pid = ctx.req.body.pid;
    let catename = ctx.req.body.catename;
    let title = ctx.req.body.title;
    let author = ctx.req.body.author;
    let is_best = ctx.req.body.is_best;
    let is_hot = ctx.req.body.is_hot;
    let is_new = ctx.req.body.is_new;
    let keywords = ctx.req.body.keywords;
    let description = ctx.req.body.description;
    let content = ctx.req.body.content;
    let status = Number(ctx.req.body.status);
    let create_time = new Date();
    let prevPage = ctx.req.body.prevPage;
    let img_url = "";
    if(ctx.req.file){
        img_url = '/upload/image/' + ctx.req.file.filename;
    }

    let json = {
        pid,catename,title,author,is_best,is_hot,is_new,keywords,description,content,img_url,create_time, status
    }
    let findResult = await DB.find("article",{_id: DB.getObjectID(id)});
    if( findResult.length > 0 ){
        if(!json.img_url){
            json.img_url = findResult[0].img_url;
        }
        let updateResult = await DB.update("article",{_id: DB.getObjectID(id)},json);
        if(updateResult.result.ok){
            if(prevPage){
                ctx.redirect(prevPage);
            }else{
                ctx.redirect('/admin/article');
            }
        };
    }else{
        ctx.render('admin/error',{
            message:'编辑失败,没有找到当前内容.',
            redirect: ctx.state.__HOST__+'/admin/article'
        });
    }
});

router.get('/ueditors', async (ctx)=>{
    ctx.render('admin/article/doUeditor');
})

router.post('/doUeditors', tools.multer().single('file'), async (ctx)=>{
    ctx.body = {
        filename: ctx.req.file,
        content: ctx.req.body,
    }
})

router.get('/upload', async (ctx)=>{
    ctx.render('admin/article/upload');
})

// upload 是加载配置时候定义名称
// file 是html中定义的input name
router.post('/doUpload', tools.multer().single('file'), async (ctx)=>{
    ctx.body = {
        body: ctx.req.body,
        filename: ctx.req.file.filename,
    }
})

module.exports = router.routes();