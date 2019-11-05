const router = require('koa-router')(),
ueditor = require('koa2-ueditor'),
url = require('url'),
index = require('./admin/index'),
login = require('./admin/login'),
user = require('./admin/user'),
manage = require('./admin/manage'),
article_cate = require('./admin/article_cate'),
article = require('./admin/article'),
forcus = require('./admin/forcus'),
link = require('./admin/link'),
nav = require('./admin/nav'),
setting = require('./admin/setting');

// 权限判断也需要在这里做
router.use( async (ctx,next)=>{
    // 配置全局变量 __HOST__
    ctx.state.__HOST__ = "http://" + ctx.request.header.host;
    let pathname = url.parse(ctx.request.url).pathname.slice(1,ctx.url.length)
    let splitUrl = pathname.split('/');
    // G
    ctx.state.G = {
        url: splitUrl,
        userInfo: ctx.session.userInfo,
        prevPage: ctx.request.headers['referer'], //上一页访问路径
    }

    if(ctx.session.userInfo){
        await next();
    }else{
        if( pathname === 'admin/login' || pathname === 'admin/login/doLogin' || pathname === 'admin/login/code' ){
            await next();
        }else{
            ctx.redirect('/admin/login');
        }
    }
});

 
router.use(index);
router.use('/login',login);
router.use('/user',user);
router.use('/manage',manage);
router.use('/article_cate',article_cate);
router.use('/article',article);
router.use('/forcus',forcus),
router.use('/link',link),
router.use('/nav',nav);
router.use('/settings',setting);

// 配置 koa2-ueditor
/**
 * /editor/controller 为上传路径 如果修改同时需要修改ueditor.config.js
 * 路由为 "/admin/editor/controller"
 * 想要修改 到 public/ueditor/ueditor.config.js 中修改
 * admin路由加了token判断所以比较安全
 * */ 
router.all('/editor/controller', ueditor(['public', {
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports = router.routes();