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
//七牛云存储
var qiniu = require('qiniu');
//时间格式化
var moment = require('moment');
//站点配置
var Settings = require("../models/db/settings");
var siteFunc = require("../models/db/siteFunc");
//数据校验
var validator = require('validator');

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


// 用户主页
router.get('/info', function(req, res, next) {
    if(isLogined(req)){
        res.render('web/users/user', {
            siteConfig : siteFunc.siteInfos("用户主页") ,
            cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
            userInfo : req.session.userInfo,
            layout: 'web/temp/user' });
    }
    else{
        res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
    }

});

//修改用户信息
router.get('/setUserInfo', function(req, res, next) {
    if(isLogined(req)){
        res.render('web/users/setUserInfo', {
            siteConfig : siteFunc.siteInfos("用户主页",'','',true) ,
            cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
            userInfo : req.session.userInfo,
            layout: 'web/temp/user' });
    }
    else{
        res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
    }

});

// 修改用户头像
router.get('/setUserLogo', function(req, res, next) {
    if(isLogined(req)){
        res.render('web/users/setUserLogo', {
            siteConfig : siteFunc.siteInfos("修改头像",'','',true) ,
            cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
            userInfo : req.session.userInfo,
            layout: 'web/temp/user' });
    }
    else{
        res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
    }

});


// 修改用户密码
router.get('/setUserPsd', function(req, res, next) {
    if(isLogined(req)){
        res.render('web/users/setUserPsd', {
            siteConfig : siteFunc.siteInfos("修改头像",'','',true) ,
            cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
            userInfo : req.session.userInfo,
            layout: 'web/temp/user' });
    }
    else{
        res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") , layout: 'web/temp/errorTemp' });
    }

});



router.get('/regByqq', function(req, res, next) {
    res.render('web/users/reg1', {
        siteConfig : siteFunc.siteInfos("用户注册") ,
        cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
        userInfo : ""
    });
});

router.get('/confirmMoreInfo', function(req, res, next) {
    res.render('web/users/reg2', {
        siteConfig : siteFunc.siteInfos("完善信息") ,
        cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
        userInfo : ""
    });
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
        User.findOne({userName : userName},function(err,user){
            if(user){
                errors = "用户名重复，请更换后重试"
                res.end(errors);
            }
            else{
                //        数据加密
                var newPsd = DbOpt.encrypt(password,"dora");
                req.body.password = newPsd;
                DbOpt.addOne(User,req, res,"add new user")
            }
        })
    }

});

// 用户注册后跳转
router.get('/doSuccess', function(req, res) {
    var params = url.parse(req.url,true);
    var key = params.query.key;
    if(!key){
        key = "0";
    }
    res.render('web/dosuccess', { siteConfig : siteFunc.siteInfos("操作成功") ,temp:"ui",successKey:key,layout: 'web/temp/errorTemp' });
});



router.get('/qq/loginSuccess', function(req, res, next) {

    res.render('web/qqloginsuccess', { siteConfig : siteFunc.siteInfos("登录成功") ,temp:"ui",successKey:"qqlogin" });

});



router.get('/qq/updateUserInfo', function(req, res, next) {

    var params = url.parse(req.url,true);

    var openid = params.query.openid;
    var userName = params.query.userName;
    var logo = params.query.logo;
    var gender = params.query.gender;
    var province = params.query.province;
    var city = params.query.city;
    var year = params.query.year;
    if(!openid){
        res.end("error");
    }
    User.findOne({'openid' : openid},function(err,result){
        if(err) throw err;

        if(result){
            var regState = 'oldUser';
            req.session.logined = true;
            req.session.userInfo = result;
            if(!result.password){
                regState = 'newUser';
            }
            return res.json({
                uInfo : regState
            });

        }else{
            var qqUser = new User();
            qqUser.openid = openid;
            qqUser.userName = userName;
            qqUser.logo = logo;
            qqUser.gender = gender;
            qqUser.province = province;
            qqUser.city = city;
            qqUser.year = year;
            qqUser.save();

            req.session.logined = true;
            req.session.userInfo = qqUser;

            return res.json({
                uInfo : 'newUser'
            });
        }
    })

});

router.post('/qq/updateUserEmail', function(req, res, next) {

    var params = url.parse(req.url,true);
    var newUserName = req.body.userName;
    var newPassword = DbOpt.encrypt(req.body.password,"dora");
    var conditions = {'openid' : params.query.openId};
    req.body.date = new Date();
    var update = {'userName': newUserName,'password' : newPassword, 'email' : req.body.email};

    User.findOne({'email' : req.body.email},function(err,user){
        if(user){
            res.end('邮箱重复');
        }else{
            User.update(conditions,update,function(err,result){
                if(err){
                    console.log(err)
                }else{
                    res.end('success');
                }
            })
        }
    });




});


//-------------------------------------留言模块开始
// 用户留言
router.post('/message/sent', function(req, res, next) {

    var contentId = req.body.contentId;
    var commentNum = Number(req.body.commentNum) + 1;

    var newObj = new Message(req.body);
    newObj.save(function(){
//        更新评论数
        Content.update({_id : contentId}, {$set:{commentNum:commentNum}}, function (err,result) {
            if(err){
                res.end(err);
            }else{
                res.end("success");
            }
        })
    });

});


//根据文章ID获取所有留言

router.get('/message/getlist', function(req, res, next) {

    var params = url.parse(req.url,true);
    var contentId = params.query.contentId;
    return res.json(DbOpt.getContentsByID(Message,req, res,{'contentId' : contentId}));

});


//-------------------------------------留言模块结束



// 用户退出
router.get('/logout', function(req, res, next) {
    req.session.logined = false;
    req.session.userInfo = "";
    res.end("success");
});

// 用户登录提交请求
router.post('/doLogin', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var newPsd = DbOpt.encrypt(password,"dora");
    User.findOne({email:email,password:newPsd},function(err,user){
        if(user){

            req.session.logined = true;
            req.session.userInfo = user;
            console.log('------------登录成功------')
            res.end("success");
        }
        else
        {
            res.end("error");
        }
    })
});

//查找指定注册用户
router.get('/userInfo', function(req, res, next) {

//    DbOpt.findOne(User,req, res," find one regUser","regUser");
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


router.get('/userMsg', function(req, res, next) {
    var params = url.parse(req.url,true);
    var currentId = params.query.uid;
    var datasInfo = DbOpt.getPaginationResult(Message,req, res,{'uid' : currentId});

    return res.json(datasInfo);
})

//修改用户密码
router.post('/userInfo/modify', function(req, res, next) {
    var password = req.body.password;
    var newPsd = DbOpt.encrypt(password,"dora");
    req.body.password = newPsd;
    DbOpt.updateOneByID(User,req, res,"modify regUser");
});

//修改用户头像
router.post('/userInfo/modifylogo', function(req, res, next) {

    var params = url.parse(req.url,true);
    var conditions = {_id : params.query.uid};
    var userlogo = req.body.logo;
    console.log('-----------userlogo---------'+userlogo)
    User.findOne(conditions,function(err,userObj){
        if(err){
            res.end(err);
        }else{
            userObj.logo = userlogo;
            userObj.save(function(err){
                if(err){
                    res.end(err);
                }else{
                    req.session.userInfo = userObj;
                    res.end('success');
                }
            });
        }
    });

});

// 用户密码找回
router.get('/findPsd', function(req, res, next) {
    res.render('web/users/confirmUserInfo', { siteConfig : siteFunc.siteInfos("密码找回") ,temp:"ui",layout: 'web/temp/user' });
});

//用户找回密码链接校验
router.get('/reSetPsd/:uid/:pid', function(req, res, next) {

    var uid = req.params.uid;
    var pid = req.params.pid;
    User.findOne({_id:uid},function(err,user){
        if(user){
            var oldlink = user.userName + user.email;
            var userPid = DbOpt.encrypt(oldlink,"dora");
            if(pid === userPid){
                res.render('web/users/reSetPsd', { siteConfig : siteFunc.siteInfos("密码重置") , temp:"ui",layout: 'web/temp/user',uid:user._id});
            }
            else{
                res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") ,temp:"ui",layout: 'web/temp/user' });
            }
        }
        else
        {
            res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") ,temp:"ui",layout: 'web/temp/user' });
        }
    })
});

// 用户密码找回提交验证
router.post('/doCheckInfo', function(req, res, next) {
    var userName = req.body.userName;
    var email = req.body.email;

    User.findOne({userName:userName,email:email},function(err,user){
        if(user){

            System.sendEmail("findPsd",user);
            res.end("success");
        }
        else
        {
            res.end("error");
        }
    })
});

//重置密码
router.post('/updatePsd', function(req, res, next) {
    var params = url.parse(req.url,true);
    var userId = params.query.uid;
    var userName = req.body.userName;
    var userPsd = req.body.password;
//    密码加密
    var newPsd = DbOpt.encrypt(userPsd,"dora");
    User.findOne({_id:userId},function(err,user){
        if(user){
//            验证是否是本人操作，提高安全性
            if(userName === user.userName){
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



router.get('/likeMembers/list', function(req, res, next) {
    var params = url.parse(req.url,true);
    var likeUserIds = params.query.likeUserIds;

    var ulist = [];
    if(likeUserIds){
        var uarry = likeUserIds.split(',');
        for(var i=0;i<uarry.length;i++){
//            var uid = uarry[i];
            var currentUser = User.find({_id : uarry[i]},'_id userName logo');
            ulist.push(currentUser)
        }
//        return ulist;

    }

    return res.json({
        ulist : ulist
    });
});


//七牛获取uptoken

router.get('/qiniu/upToken', function(req, res, next) {

    var myUptoken = new qiniu.rs.PutPolicy(Settings.QINIUCMSBUCKETNAME);
    var token = myUptoken.token();

    moment.locale('en');
    var currentKey = moment(new Date()).format('YYYY-MM-DD--HH-mm-ss');
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (token) {
        res.json({
            uptoken: token,
            sava_key :currentKey
        });
    }

});




module.exports = router;
