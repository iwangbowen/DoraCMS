
/*引用模块*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var routes = require('./routes/index');
//用户相关功能
var users = require('./routes/users');
var admin = require('./routes/admin');
var content = require('./routes/content');
//验证器
var validat = require('./routes/validat');
//系统功能支持
var system = require('./routes/system');
//站点配置
var Settings = require("./models/db/settings");
var siteFunc = require("./models/db/siteFunc");
//文件操作对象
var fs = require('fs');
//时间格式化
var moment = require('moment');
//七牛云存储
var qiniu = require('qiniu');
//引入session插件
var fk = require('stuwebfk');
/*模板引擎*/
var partials = require('express-partials');


/*实例化express对象*/
var app = express();

//ueditor注册
var ueditor = require('ueditor-nodejs');
app.use('/ueditor/ue', ueditor({//这里的/ueditor/ue是因为文件件重命名为了ueditor,如果没改名，那么应该是/ueditor版本号/ue
    configFile: '/ueditor/jsp/config.json',//如果下载的是jsp的，就填写/ueditor/jsp/config.json
    mode: 'local', //本地存储填写local
    accessKey: '',//本地存储不填写，bcs填写
    secrectKey: '',//本地存储不填写，bcs填写
    staticPath: path.join(__dirname, 'public'), //一般固定的写法，静态资源的目录，如果是bcs，可以不填
    dynamicPath: '/blogpicture' //动态目录，以/开头，bcs填写buckect名字，开头没有/.路径可以根据req动态变化，可以是一个函数，function(req) { return '/xx'} req.query.action是请求的行为，uploadimage表示上传图片，具体查看config.json.
}));

//七牛key
qiniu.conf.ACCESS_KEY = Settings.QINIUACCESS_KEY;
qiniu.conf.SECRET_KEY = Settings.QINIUSECRET_KEY;

// view engine setup
//静态压缩
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'})); // 限制上传5M
app.use(bodyParser.urlencoded({ extended: false , limit: '50mb' }));
app.use(cookieParser());
//解决异步层次混乱问题
app.use(require('express-promise')());

//session设置
app.use(fk.session);
app.use(function(req, res, next){
//    针对注册会员
    res.locals.logined = req.session.logined;
    res.locals.userInfo = req.session.userInfo;
//    针对管理员
    res.locals.adminlogined = req.session.adminlogined;
    res.locals.adminUserInfo = req.session.adminUserInfo;

//    定义静态文件域
    res.locals.staticFilePath = Settings.STATICFILEPATH;
//    定义上传文件域
    res.locals.updateFilePath = Settings.UPDATEFILEPATH;
//    指定站点域名
    res.locals.myDomain = req.headers.host;

    next();
});

//配置站点地图和robots抓取
app.get('/sitemap.xml',function(req, res, next) {
    var stream=fs.createReadStream('./sitemap.xml',{flags:'r'});
    stream.pipe(res);
});

app.get('/robots.txt',function(req, res, next) {
    var stream=fs.createReadStream('./robots.txt',{flags:'r'});
    stream.pipe(res);
});

//非www跳转到www
app.get('/*', function (req, res, next) {
    var haswww = req.headers.host.match(/^www\./)
        , url = ['http://www.', req.headers.host, req.url].join('');

    if((req.headers.host).indexOf('127')>=0){
        next();
    }else{
        haswww ? next() : res.redirect(301, url);
    }

});

//数据格式化
app.locals.myDateFormat = function(date){
    moment.locale('zh-cn');
    return moment(date).startOf('hour').fromNow();
};

app.locals.myDateFormat1 = function(date){
    return moment(date).format('HH:mm MM-DD-YYYY');
};

//缩略图生成参数
app.locals.thumbnailUrl = function(size){
    return '?imageMogr2/thumbnail/'+size+'/strip/quality/100/format/png';
};


//字符截取
app.locals.cutMoreWords = function(str,length){
    var newStr = str;
    if(str.length > length){
        newStr = str.substring(0,length) + "..."
    }
    return newStr;
};

app.use(express.static(path.join(__dirname, 'public')));

/*指定路由控制*/
app.use('/admin', validat);
app.use('/admin', admin);
app.use('/users', users);
app.use('/', routes);
app.use('/content', content);
app.use('/system',system);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
    console.log(err);
    res.render('web/do404', { siteConfig : siteFunc.siteInfos("页面找不到了") });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('web/do500', { siteConfig : siteFunc.siteInfos("程序内部错误") ,errInfo : err.message,temp:"ui",layout: 'web/temp/errorTemp' });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('web/do500', { siteConfig : siteFunc.siteInfos("程序内部错误") ,errInfo : err.message,temp:"ui",layout: 'web/temp/errorTemp' });
});






module.exports = app;
