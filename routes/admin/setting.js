const router = require('koa-router')();
const DB = require('../../module/db');
const tools = require('../../module/tools');

router.get('/',async (ctx)=>{
    let findResult = await DB.find('setting',{})
    await ctx.render('admin/setting/index',{site_info: findResult[0]});
});

router.post('/doSettings', tools.multer().single('site_logo'), async (ctx)=>{

    let site_title = ctx.req.body.site_title,
        site_keywords = ctx.req.body.site_keywords,
        site_description = ctx.req.body.site_description,
        site_icp = ctx.req.body.site_icp,
        site_qq = ctx.req.body.site_qq,
        site_tel = ctx.req.body.site_tel,
        site_address = ctx.req.body.site_address,
        site_status = ctx.req.body.site_status,
        add_time = new Date(),
        site_logo = ctx.req.file;

    let json = {}
    if(!site_logo){
        json = {site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time}
    }else{
        site_logo = '/upload/image/' + ctx.req.file.filename;
        json = {site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,site_logo,add_time}
    }

    let result = await DB.update('setting',{},json);
    if(result.result.ok){
        ctx.redirect('/admin/settings');
    }else{
        ctx.render('admin/error',{
            message:'更新或者添加失败',
            redirect: ctx.state.__HOST__+'/admin/settings'
        });
    }
    
});

module.exports = router.routes();
