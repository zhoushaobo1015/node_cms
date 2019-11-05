const router = require('koa-router')();
const tools = require('../../module/tools');
const DB = require('../../module/db');

//验证码模块
var svgCaptcha = require('svg-captcha');

router.get('/',async (ctx)=>{
    await ctx.render('admin/login');
})

//post
router.post('/doLogin',async (ctx)=>{
    //首先得去数据库匹配
    let username=ctx.request.body.username;
    let password=ctx.request.body.password;
    let code=ctx.request.body.code;
    //1、验证用户名密码是否合法
    //2、去数据库匹配
    //3、成功以后把用户信息写入sessoin
    if(code.toLocaleLowerCase()==ctx.session.code.toLocaleLowerCase()){
        //后台也要验证码用户名密码是否合法
        let result = await DB.find('admin',{"username":username,"password":tools.md5(password)});
        if(result.length <= 0) {
            ctx.render('admin/error',{
                message:'用户名或者密码错误',
                redirect: ctx.state.__HOST__+'/admin/login'
            })
        }else{
            ctx.session.userInfo = result[0];
            let id = result[0]._id
            let status = result[0].status;
            if(status){
                await DB.update("admin",{_id: DB.getObjectID(id)},{last_login_date:new Date()})
                ctx.redirect('/admin/');
            }
            else{
                ctx.render('admin/error',{
                    message:'账户被禁用,请联系管理员.',
                    redirect: ctx.state.__HOST__+'/admin/login'
                })
            }
        };
    }else{
        ctx.render('admin/error',{
            message:'验证码失败',
            redirect: ctx.state.__HOST__+'/admin/login'
        })
    }
})

/**
 * 退出登录 
 **/ 
router.get('/logout', async (ctx)=>{
    ctx.state.userInfo = null;
    await ctx.redirect( ctx.state.__HOST__+'/admin/login');
})

/*验证码*/
router.get('/code',async (ctx)=>{
    //加法的验证码
    //var captcha = svgCaptcha.createMathExpr({
    //    size:4,
    //    fontSize: 50,
    //    width: 100,
    //    height:40,
    //    background:"#cc9966"
    //});
    
    var captcha = svgCaptcha.create({
        size:4,
        fontSize: 40,
        width: 120,
        height:34,
        background:"#cc9966"
    });
    console.log(captcha.text,captcha);
    //保存生成的验证码
    ctx.session.code=captcha.text;
    //设置响应头
    ctx.response.type = 'image/svg+xml';
    ctx.body=captcha.data;
})

module.exports=router.routes();