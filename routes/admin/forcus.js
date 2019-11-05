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
    let findResult = await DB.find('forcus',{},{},{sort:{'add_time':-1}});
    ctx.render('admin/forcus/list',{list:findResult});
});

router.get('/add',(ctx)=>{
    ctx.render('admin/forcus/add');
});

router.post('/doAdd', tools.multer().single('file'), async (ctx)=>{
    let title = ctx.req.body.title;
    let description = ctx.req.body.description;
    let link = ctx.req.body.link;
    let sort = ctx.req.body.sort;
    let pic = null;
    console.log(ctx.req.file,ctx.req);

    if(ctx.req.file){
        pic = '/upload/image/' + ctx.req.file.filename;
    }
    let json = {
        title,
        description,
        pic,
        add_time: new Date(),
        link,
        sort,
    }
    let insertResult = await DB.insert('forcus',json);
    if(insertResult.result.ok){
        ctx.redirect('/admin/forcus');
    }else{
        ctx.redirect('/admin/forcus/add');
    }
});

router.get('/remove', async (ctx) => {
    let collection = ctx.query.collection;
    let id = ctx.query.id;
    let url = ctx.query.url;

    if(!collection || !id || !url){
        ctx.redirect('/admin/forcus')
    }else{

        let result = await DB.remove(collection,{_id: DB.getObjectID(id)});
        if(result.result.ok){
            ctx.redirect(url);
        }else{
            ctx.render('admin/error',{
                message:'删除失败',
                redirect: ctx.state.__HOST__+'/admin/forcus'
            });
        }
    }
})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    if(!id){
        ctx.redirect('/admin/forcus');
    }else{
        let findResult = await DB.find('forcus',{_id: DB.getObjectID(id)})
        if(findResult.length > 0){
            ctx.render('admin/forcus/edit',{info:findResult[0]})
        }else{
            ctx.redirect('/admin/forcus');
        }
    }
})

router.post('/doEdit', tools.multer().single('file'), async (ctx) => {
    let title = ctx.req.body.title;
    let description = ctx.req.body.description;
    let link = ctx.req.body.link;
    let sort = ctx.req.body.sort;
    let id = ctx.req.body.id;
    let pic = ctx.req.file;
    if(pic){
        pic = '/upload/image/' + pic.filename;
    }else{
        pic = ctx.req.body.pic;
    }

    let json = {title,description,link,pic,sort};
    let updateResult = await DB.update('forcus',{_id: DB.getObjectID(id)},json);
    if(updateResult.result.ok){
        ctx.redirect('/admin/forcus');
    }else{
        ctx.render('admin/error',{
            message:'更新失败',
            redirect: ctx.state.G.prevPage,
        });
    }
})



module.exports = router.routes();
