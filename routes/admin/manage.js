/**
 * Created by Administrator on 2018/3/20 0020.
 */
const router = require('koa-router')();
// const multer = require('koa-multer');
const DB = require('../../module/db');
const tools = require('../../module/tools');
// let paths = null;
// // 配置koa-multer
// var storage = multer.diskStorage({
//     //文件保存路径
//     destination: function (req, file, cb) {
//         cb(null, 'public/admin/avatars/');
//     },
//     //修改文件名称
//     filename: function (req, file, cb) {
//     //注意路径必须存在
//     var fileFormat = (file.originalname).split(".");
//     paths = Date.now() + "." + fileFormat[fileFormat.length - 1]
//     cb(null,paths); }
// })

// //加载配置
// var upload = multer({ storage: storage })

router.get('/',async (ctx)=>{
    let result = null;
    try{
        result =  await DB.find('admin',{})
    }catch(err){
        console.log(err)
    }
    await  ctx.render('admin/manage/list',{userList:result});
})

router.get('/add',async (ctx)=>{
    await  ctx.render('admin/manage/add');
})

router.post('/add_user', tools.multer().single('file'), async (ctx)=>{
    let username = ctx.req.body.username;
    let password = ctx.req.body.password;

    if( !/^\w{4,20}/.test(username) ){
        ctx.render('admin/error',{
            message:'用户名不合法',
            redirect: ctx.state.__HOST__+'/admin/manage/add'
        })
    }
    else if ( password.length < 6 ) {
        ctx.render('admin/error',{
            message:'密码长度大于5位',
            redirect: ctx.state.__HOST__+'/admin/manage/add'
        })
    }
    else {
        // 上传头像留待以后完成
        let findResult = await DB.find('admin',{username});
        if(findResult.length>0){
            ctx.render('admin/error',{
                message:'账号已存在',
                redirect: ctx.state.__HOST__+'/admin/manage/add'
            })
        }else{
            let passwd = tools.md5(password);
            let result = await DB.insert('admin',{username, password:passwd, status:1, image:"/admin/avatars/"+paths});
            if(result.result.ok){
                ctx.render('admin/error',{
                    message:'添加账号成功 :)',
                    redirect: ctx.state.__HOST__+'/admin/manage/add'
                })
            }else{
                ctx.render('admin/error',{
                    message:'添加账号失败~。~!!!',
                    redirect: ctx.state.__HOST__+'/admin/manage/add'
                })
            }
        }
    }
})

router.get('/edit',async (ctx)=>{
    let id = ctx.query.id
    let result = await DB.find('admin',{_id:DB.getObjectID(id)});
    ctx.render('admin/manage/edit',{data: result[0]})
})

router.post('/edit_user',async (ctx)=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let id = ctx.request.body._id;

    if( !/^\w{4,20}/.test(username) ){
        ctx.render('admin/error',{
            message:'用户名不合法',
            redirect: ctx.state.__HOST__+'/admin/manage/edit?id='+id
        })
    }
    else if ( password.length < 6 ) {
        ctx.render('admin/error',{
            message:'密码长度大于5位',
            redirect: ctx.state.__HOST__+'/admin/manage/edit?id='+id
        })
    }
    else {
        password = tools.md5(password);
        let result = await DB.update('admin',{_id: DB.getObjectID(id)},{username, password});
        if(result.result.ok){
            ctx.render('admin/error',{
                message:'更新成功 :)',
                redirect: ctx.state.__HOST__+'/admin/manage'
            });
        }else{
            ctx.render('admin/error',{
                message:'更新失败 ~。~!!!',
                redirect: ctx.state.__HOST__+'/admin/manage/edit?id='+id
            });
        }
    }
})


module.exports=router.routes();