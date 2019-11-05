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

router.get('/',async (ctx)=>{
    let findResult = await DB.find('nav',{},{},{sort:{'add_time':-1}});
    ctx.render('admin/nav/list',{list:findResult});
});

router.get('/add',(ctx)=>{
    ctx.render('admin/nav/add');
});

router.post('/doAdd', tools.multer().single('file'), async (ctx)=>{
    let title = ctx.req.body.title;
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let json = {
        title,
        url,
        add_time: new Date(),
        status,
    }
    let insertResult = await DB.insert('nav',json);
    if(insertResult.result.ok){
        ctx.redirect('/admin/nav');
    }else{
        ctx.redirect('/admin/nav/add');
    }
});

router.get('/remove', async (ctx) => {
    let collection = ctx.query.collection;
    let id = ctx.query.id;
    let url = ctx.query.url;

    if(!collection || !id || !url){
        ctx.redirect('/admin/nav')
    }else{

        let result = await DB.remove(collection,{_id: DB.getObjectID(id)});
        if(result.result.ok){
            ctx.redirect(url);
        }else{
            ctx.render('admin/error',{
                message:'删除失败',
                redirect: ctx.state.__HOST__+'/admin/nav'
            });
        }
    }
})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    if(!id){
        ctx.redirect('/admin/nav');
    }else{
        let findResult = await DB.find('nav',{_id: DB.getObjectID(id)})
        if(findResult.length > 0){
            ctx.render('admin/nav/edit',{info:findResult[0]})
        }else{
            ctx.redirect('/admin/nav');
        }
    }
})

router.post('/doEdit', tools.multer().single('file'), async (ctx) => {
    let title = ctx.req.body.title;
    let url = ctx.req.body.url;
    let status = ctx.req.body.status;
    let id = ctx.req.body.id;
    let json = {title,url,status}
    let updateResult = await DB.update('nav',{_id: DB.getObjectID(id)},json);
    if(updateResult.result.ok){
        ctx.redirect('/admin/nav');
    }else{
        ctx.render('admin/error',{
            message:'更新失败',
            redirect: ctx.state.G.prevPage,
        });
    }
})



module.exports = router.routes();
