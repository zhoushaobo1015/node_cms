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
    let findResult = await DB.find('link',{},{},{sort:{'add_time':-1}});
    ctx.render('admin/link/list',{list:findResult});
});

router.get('/add',(ctx)=>{
    ctx.render('admin/link/add');
});

router.post('/doAdd', tools.multer().single('file'), async (ctx)=>{
    let title = ctx.req.body.title;
    let link = ctx.req.body.link;
    let status = ctx.req.body.status;
    let pic = null;
    if(ctx.req.file){
        pic = '/upload/image/' + ctx.req.file.filename;
    }
    let json = {
        title,
        link,
        pic,
        add_time: new Date(),
        status,
    }
    let insertResult = await DB.insert('link',json);
    if(insertResult.result.ok){
        ctx.redirect('/admin/link');
    }else{
        ctx.redirect('/admin/link/add');
    }
});

router.get('/remove', async (ctx) => {
    let collection = ctx.query.collection;
    let id = ctx.query.id;
    let url = ctx.query.url;

    if(!collection || !id || !url){
        ctx.redirect('/admin/link')
    }else{
        let result = await DB.remove(collection,{_id: DB.getObjectID(id)});
        if(result.result.ok){
            ctx.redirect(url);
        }else{
            ctx.render('admin/error',{
                message:'删除失败',
                redirect: ctx.state.__HOST__+'/admin/link'
            });
        }
    }
})

router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    if(!id){
        ctx.redirect('/admin/link');
    }else{
        let findResult = await DB.find('link',{_id: DB.getObjectID(id)})
        if(findResult.length > 0){
            ctx.render('admin/link/edit',{info:findResult[0]})
        }else{
            ctx.redirect('/admin/link');
        }
    }
})

router.post('/doEdit', tools.multer().single('file'), async (ctx) => {
    let id = ctx.req.body.id;
    let title = ctx.req.body.title;
    let link = ctx.req.body.link;
    let pic = ctx.req.file;
    let status = ctx.req.body.status;
    if(pic){
        pic = '/upload/image/' + pic.filename;
    }else{
        pic = ctx.req.body.pic;
    }

    let json = {title,link,pic,status}

    console.log(json);
    
    let updateResult = await DB.update('link',{_id: DB.getObjectID(id)},json);
    if(updateResult.result.ok){
        ctx.redirect('/admin/link');
    }else{
        ctx.render('admin/error',{
            message:'更新失败',
            redirect: ctx.state.G.prevPage,
        });
    }
})



module.exports = router.routes();
