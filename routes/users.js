var express = require('express');
var router = express.Router();
var url = require('url');
//验证
var validator = require("validator");
//文章类别对象
var ContentCategory = require("../models/ContentCategory");
//用户实体类
var User = require("../models/User");
//留言实体类
var Message = require("../models/Message");
// 文档对象
var Content = require("../models/Content");
//数据库操作对象
var DbOpt = require("../models/Dbopt");
//加密类
var crypto = require("crypto");
//系统相关操作
var System = require("../models/System");
//时间格式化
var moment = require('moment');
//站点配置
var Settings = require("../models/db/settings");
var siteFunc = require("../models/db/siteFunc");

//数据校验
var filter = require('../util/filter');

//自定义校验扩展
validator.extend('isUserName', function (str) {
    return /^[a-zA-Z][a-zA-Z0-9_]{4,11}$/.test(str);
});

validator.extend('isGBKName', function (str) {
    return /[\u4e00-\u9fa5]/.test(str);
});

validator.extend('isPsd', function (str) {
    return /(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{6,}/.test(str);
});

//校验是否登录
function isLogined(req){
    return req.session.logined;
}



//用户登录

router.get('/login', function(req, res, next) {

    if(isLogined(req)){
        res.render('web/index', siteFunc.setDataForIndex(req, res, {'type': 'content'}, '首页'))
    }else{
        req.session._loginReferer = req.headers.referer;
        res.render('web/users/userLogin', siteFunc.setDataForUser(req, res, '用户登录'))
    }

});

// 用户登录提交请求
router.post('/doLogin', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var newPsd = DbOpt.encrypt(password,"dora");
    User.findOne({email:email,password:newPsd},function(err,user){
        if(user){
//            将cookie存入缓存
            filter.gen_session(user, res);
            console.log('------------登录成功------');
            res.end("success");
        }
        else
        {
            res.end("error");
        }
    })
});

//用户注册
router.get('/reg', function(req, res, next) {

    res.render('web/users/userReg', siteFunc.setDataForUser(req, res, '用户注册'))

});


// 用户注册
router.post('/doReg', function(req, res, next) {
    var errors;
    var userName = req.body.userName;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPsd = req.body.confirmPassword;
//    数据校验
    if(!validator.isUserName(userName)){
        errors = "用户名5-12个英文字符";
    }
    if(!validator.isPsd(password) && validator.isLength(password,6,12)){
        errors = "密码6-12个字符";
    }
    if(password !== confirmPsd)
    {
        errors = "密码不匹配，请重新输入";
    }
    if(!validator.isEmail(email)){
        errors = "请填写正确的邮箱地址";
    }
    if(errors){
        res.end(errors);
    }else{
        User.findOne({email : email},function(err,user){
            if(user){
                errors = "邮箱重复，请更换后重试"
                res.end(errors);
            }
            else{
                //        数据加密
                var newPsd = DbOpt.encrypt(password,"dora");
                req.body.password = newPsd;
                DbOpt.addOne(User,req, res,"add a new user")
            }
        })
    }

});



// 用户主页
//router.get('/info', function(req, res, next) {
//    if(isLogined(req)){
//        res.render('web/users/user', {
//            siteConfig : siteFunc.siteInfos("用户主页") ,
//            cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
//            userInfo : req.session.userInfo,
//            layout: 'web/temp/user' });
//    }
//    else{
//        res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
//    }
//
//});

//用户中心
router.get('/userCenter', function(req, res, next) {
    if(isLogined(req)){
        res.render('web/users/userCenter', siteFunc.setDataForUser(req, res, '用户中心'));
    }
    else{
        res.render('web/public/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
    }

});


// 修改用户密码页面
router.get('/setUserPsd', function(req, res, next) {
    if(isLogined(req)){
        res.render('web/users/userSetPsd', siteFunc.setDataForUser(req, res, '密码重置'));
    }
    else{
        res.render('web/public/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
    }

});

// 用户退出
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.clearCookie(Settings.auth_cookie_name, { path: '/' });
    res.end("success");
});


//查找指定注册用户
router.get('/userInfo', function(req, res, next) {

    var params = url.parse(req.url,true);
    var currentId = (params.query.uid).split('.')[0];
    User.findOne({_id : currentId}, function (err,result) {
        if(err){

        }else{
//                针对有密码的记录，需要解密后再返回
            if(result && result.password){
                var decipher = crypto.createDecipher("bf","dora");
                var oldPsd = "";
                oldPsd += decipher.update(result.password,"hex","utf8");
                oldPsd += decipher.final("utf8");
                result.password = oldPsd;
            }
            return res.json(result);
        }
    })
});



//修改用户信息
router.post('/userInfo/modify', function(req, res, next) {
    var password = req.body.password;
    var newPsd = DbOpt.encrypt(password,"dora");
    req.body.password = newPsd;
    DbOpt.updateOneByID(User,req, res,"modify regUser");
});


//密码修改
router.post('/resetMyPsd', function(req, res, next) {
    var params = url.parse(req.url,true);
    var userId = params.query.uid;
    var oldPassword = req.body.oldPassword;
    var userPsd = req.body.password;
//    密码加密
    var oldPsd = DbOpt.encrypt(oldPassword,"dora");
    var newPsd = DbOpt.encrypt(userPsd,"dora");
    User.findOne({_id:userId},function(err,user){
        if(user){
//            验证是否是本人操作，提高安全性
            if(oldPsd === user.password){
//                更新密码
                User.update({_id:userId}, {password : newPsd}, function (err,result) {
                    if(err){

                    }else{
                        res.end("success");
                    }
                })
            }
            else{
                res.end("error");
            }
        }
        else
        {
            res.end("error");
        }
    })
});





//-------------------------------------留言模块开始
// 用户留言
router.post('/message/sent', function(req, res, next) {

    var contentId = req.body.contentId;

    var newObj = new Message(req.body);
    newObj.save(function(){
//        更新评论数
        Content.findOne({_id : contentId},'commentNum',function(err,result){
            if(err){
                res.end(err);
            }else{
                result.commentNum = result.commentNum + 1;
                result.save(function(err){
                    if(err) throw err;
                    res.end("success");
                });
            }
        });

    });

});


//根据文章ID获取所有留言

router.get('/message/getlist', function(req, res, next) {

    var params = url.parse(req.url,true);
    var contentId = params.query.contentId;
    return res.json(DbOpt.getDatasByParam(Message,req, res,{'contentId' : contentId}));

});


//-------------------------------------留言模块结束




module.exports = router;
