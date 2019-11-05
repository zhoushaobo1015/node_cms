const Koa = require('koa'),
router = require('koa-router')(),
render = require('koa-art-template'),
static = require('koa-static'),
session = require('koa-session'),
bodyParser = require('koa-bodyparser'),
jsonp = require('koa-jsonp'),
sd = require('silly-datetime'),
// koaBody = require('koa-body'),
path = require('path');

const admin = require('./routes/admin'),
api = require('./routes/api'),
index = require('./routes/index');


const app = new Koa();
// 配置静态文件
app.use(static(__dirname + '/public'));

// 配置渲染模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = value => { // 自定义格式化日期方法
        return sd.format(new Date(value), 'YYYY-MM-DD HH:mm');
    }
});

// 配置session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',    //cookie key (default is koa:sess)
    maxAge: 60*60*1000, //*cookie 的过期时间 maxAge in ms (default is 1 days)
    overwrite: true,    //是否可以 overwrite (默认 default true) 设置了没有效果
    httpOnly: true,     //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
    signed: true,       //签名默认 true
    rolling:false,      //在每次请求时强行设置cookie，这将重置cookie过期时间(默认:false)
    renew: true,       //*(boolean) renew session when session is nearly expired,当session快要过期时候才会重新设置
}
app.use( session(CONFIG, app) );

// 初始化jsonp
app.use(jsonp());

// post请求参数
app.use(bodyParser());

router.use('/admin',admin);
router.use('/api',api);
router.use(index);

// 启动路由
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000,()=>{
    console.log("http://localhost:3000/");
})