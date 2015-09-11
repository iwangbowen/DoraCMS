var express = require('express');
var router = express.Router();
var url = require('url');

//管理员对象
var AdminUser = require("../models/AdminUser");
//管理员用户组对象
var AdminGroup = require("../models/AdminGroup");
// 文档对象
var Content = require("../models/Content");
//数据操作日志
var DataOptionLog = require("../models/DataOptionLog");
//文章类别对象
var ContentCategory = require("../models/ContentCategory");
//文章标签对象
var ContentTags = require("../models/ContentTags");
//文章模板对象
var ContentTemplate = require("../models/ContentTemplate");
//文章留言对象
var Message = require("../models/Message");
//注册用户对象
var User = require("../models/User");
//邮件模板对象
var EmailTemp = require("../models/EmailTemp");
//广告对象
var Ads = require("../models/Ads");
//数据校验
var validator = require('validator');
//系统操作
var system = require("../util/system");
//站点配置
var settings = require("../models/db/settings");
var adminFunc = require("../models/db/adminFunc");
//加密类
var crypto = require("crypto");
//数据库操作对象
var DbOpt = require("../models/Dbopt");
/* GET home page. */


//权限校验回调函数
function checkAdminPower(req,key,callBack) {

    var uGroupId = req.session.adminUserInfo.group;
    AdminGroup.findOne({_id : uGroupId},function(err,result){
        if(err){
            console.log(err)
        }else{
            var power = false;
            if(result){
                var uPower = result.power;
                if(uPower){
                    var newPowers = JSON.parse(uPower);
                    for(var cateName in newPowers){
                        if(cateName === key[0] && newPowers[cateName]){
                            power = true;
                            break;
                        }
                    }
                }
            }
            callBack(power);
        }
    })
}


//管理员登录页面
router.get('/', function(req, res, next) {
  res.render('manage/adminLogin', { title: settings.SITETITLE , description : 'DoraCMS后台管理登录'});
});

// 管理员登录提交请求
router.post('/doLogin', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var newPsd = DbOpt.encrypt(password,settings.encrypt_key);
    AdminUser.findOne({username:username,password:newPsd},function(err,user){
        if(user){
            req.session.adminlogined = true;
            req.session.adminUserInfo = user;
            res.end("success");
        }
        else
        {
            console.log("登录失败");
            res.end("error");
        }
    })
});

// 管理员退出
router.get('/logout', function(req, res, next) {
    req.session.adminlogined = false;
    res.redirect("/admin");
});

//后台用户起始页
router.get('/manage', function(req, res, next) {
  res.render('manage/main', adminFunc.setPageInfo(req,res,settings.SYSTEMMANAGE));
});



//对象列表查询
router.get('/manage/getDocumentList/:defaultUrl',function(req,res,next){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminFunc.getTargetObj(currentPage);

    var params = url.parse(req.url,true);
    var keywords = params.query.searchKey;
    var keyPr = [];

    if(keywords){
        var reKey = new RegExp(keywords, 'i');
        if(targetObj == Content){
            keyPr.push({'comments' : { $regex: reKey } });
            keyPr.push({'title' : { $regex: reKey } });

        }else if(targetObj == AdminUser){
            keyPr = {'username' : { $regex: reKey} };
        }else if(targetObj == User){
            keyPr = {'userName' : { $regex: reKey} };
        }

    }

    DbOpt.pagination(targetObj,req, res,keyPr)
});



//对象删除
router.get('/manage/:defaultUrl/del',function(req,res,next){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminFunc.getTargetObj(currentPage);

    if(targetObj == Message){
        removeMessage(req,res)
    }else{
        DbOpt.del(targetObj,req,res,"del one obj success");
    }

});

//获取单个对象数据
router.get('/manage/:defaultUrl/item',function(req,res,next){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminFunc.getTargetObj(currentPage);
    DbOpt.findOne(targetObj,req, res,"find one obj success")
});



//更新单条记录(获取数据)
router.post('/manage/:defaultUrl/modify',function(req,res,next){
    var currentPage = req.params.defaultUrl;
    var targetObj = adminFunc.getTargetObj(currentPage);
    if(targetObj == AdminUser || targetObj == User){
        var password = req.body.password;
        var newPsd = DbOpt.encrypt(password,settings.encrypt_key);
        req.body.password = newPsd;
    }
    DbOpt.updateOneByID(targetObj,req, res,"find one obj success")
});


//对象新增
router.post('/manage/:defaultUrl/addOne',function(req,res,next){

    var currentPage = req.params.defaultUrl;
    var targetObj = adminFunc.getTargetObj(currentPage);

    if(targetObj == AdminUser){
        addOneAdminUser(req,res);
    }else if(targetObj == ContentCategory){
        addOneCategory(req,res)
    }else if(targetObj == ContentTags){
        addOneContentTags(req,res)
    }else if(targetObj == ContentTemplate){
        addOneContentTemps(req,res)
    }else{
        DbOpt.addOne(targetObj,req, res,"add one obj");
    }

});



//删除留言
function removeMessage(req,res){
    var params = url.parse(req.url,true);
    Message.findOne({_id : params.query.uid},'contentId',function(err,result){
        if(err){
            res.end(err);
        }else{
            var contentId = result.contentId;
            Content.findOne({_id : contentId},function(err,contentObj){
                if(err){
                    res.end(err);
                }else{
                    Message.remove({_id : params.query.uid},function(err){
                        if(contentObj.commentNum > 0){
                            contentObj.commentNum = contentObj.commentNum -1 ;
                            contentObj.save(function(err){
                                if(err){
                                    res.end(err);
                                }else{
                                    res.end("success");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}


//系统用户管理（list）
router.get('/manage/adminUsersList', function(req, res, next) {

    checkAdminPower(req,settings.ADMINUSERLIST,function(state){

        if(state){
            res.render('manage/adminUsersList', adminFunc.setPageInfo(req,res,settings.ADMINUSERLIST));
        }else{
            res.redirect("/admin/manage");
        }

    });

});



//添加系统用户

function addOneAdminUser(req,res){
    var errors;
    AdminUser.findOne({username:req.body.username},function(err,user){
        if(user){
            errors = "该用户名已存在！";
            res.end(errors);
        }else{
            if(errors){
                res.end(errors)
            }else{
                //    密码加密
                req.body.password = DbOpt.encrypt(req.body.password,settings.encrypt_key);
                DbOpt.addOne(AdminUser,req, res,"add new adminUser");
            }
        }
    })
}


//------------------------------------------系统用户管理结束



//------------------------------------------用户组管理面开始

//系统用户组管理（list）
router.get('/manage/adminGroupList', function(req, res, next) {

    checkAdminPower(req,settings.ADMINGROUPLIST,function(state){

        if(state){
            res.render('manage/adminGroup', adminFunc.setPageInfo(req,res,settings.ADMINGROUPLIST));
        }else{
            res.redirect("/admin/manage");
        }

    })



});

//系统管理员用户组列表
router.get('/manage/adminGroupList/list', function(req, res, next) {
    DbOpt.findAll(AdminGroup,req, res,"request adminGroupList")
});


//------------------------------------------用户组管理面结束




//------------------------------------------文件管理器开始

//文件管理界面（list）
router.get('/manage/filesList', function(req, res, next) {

    checkAdminPower(req,settings.FILESLIST,function(state){
        if(state){
            res.render('manage/filesList', adminFunc.setPageInfo(req,res,settings.FILESLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })
});


//文件夹列表查询
router.get('/manage/filesList/list', function(req, res, next) {
    var params = url.parse(req.url,true);
    var path = params.query.filePath;
    if(!path){
        path =  settings.UPDATEFOLDER;
    }

    var filePath = system.scanFolder(path);
//    对返回结果做初步排序
    filePath.sort(function(a,b){return a.type == "folder" ||  b.type == "folder"});
    return res.json({
        rootPath : settings.UPDATEFOLDER,
        pathsInfo : filePath
    });

});


//文件删除
router.get('/manage/filesList/fileDel', function(req, res, next) {
    var params = url.parse(req.url,true);
    var path = params.query.filePath;
    if(path){
        system.deleteFolder(req, res, path);
    }
});

//文件重命名
router.post('/manage/filesList/fileReName', function(req, res, next) {
    var newPath = req.body.newPath;
    var path = req.body.path;
    if(path && newPath){
        system.reNameFile(req,res,path,newPath);
    }
});

//修改文件内容读取文件信息
router.get('/manage/filesList/getFileInfo', function(req, res, next) {

    var params = url.parse(req.url,true);
    var path = params.query.filePath;
    if(path){
        system.readFile(req,res,path);
    }
});

//修改文件内容更新文件信息
router.post('/manage/filesList/updateFileInfo', function(req, res, next) {

    var fileContent = req.body.code;
    var path = req.body.path;
    if(path){
        system.writeFile(req,res,path,fileContent);
    }
});

//------------------------------------------文件管理器结束


//------------------------------------------数据管理开始

router.get('/manage/dataManage/m/backUpData', function(req, res, next) {

    checkAdminPower(req,settings.DATAMANAGE,function(state){
        if(state){
            res.render('manage/backUpData', adminFunc.setPageInfo(req,res,settings.DATAMANAGE));
        }else{
            res.redirect("/admin/manage");
        }
    })
});


//备份数据库执行
router.get('/manage/backupDataManage/backUp', function(req, res, next) {
    system.backUpData(res,req);
});


//备份数据记录删除
router.get('/manage/backupDataManage/del', function(req, res, next) {

    var params = url.parse(req.url,true);
    var forderPath = params.query.filePath;
    DataOptionLog.remove({_id : params.query.uid},function(err,result){
        if(err){
            res.end(err);
        }else{
            if(forderPath){
                system.deleteFolder(req, res,forderPath);
            }else{
                res.end("error");
            }
        }
    })

});

//------------------------------------------数据管理结束



//------------------------------------------文档管理面开始
//文档列表页面
router.get('/manage/contentList', function(req, res, next) {


    checkAdminPower(req,settings.CONTENTLIST,function(state){
        if(state){
            res.render('manage/contentList', adminFunc.setPageInfo(req,res,settings.CONTENTLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});



//文档添加页面(默认)
router.get('/manage/content/add/:key', function(req, res, next) {

    var contentType = req.params.key;
    var targetPath;
    checkAdminPower(req,settings.CONTENTLIST,function(state){

        if(contentType == "film"){
            targetPath = 'manage/addProduct';
        }if(contentType == "plug"){
            targetPath = 'manage/addPlugs';
        }else{
            targetPath = 'manage/addContent';
        }

        if(state){
            res.render(targetPath, adminFunc.setPageInfo(req,res,settings.CONTENTLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })
});



//文档编辑页面
router.get('/manage/content/edit/:type/:content', function(req, res, next) {
    var contentType = req.params.type;
    var targetPath;
    checkAdminPower(req,settings.CONTENTLIST,function(state){

        if(contentType == "film"){
            targetPath = 'manage/addProduct';
        }if(contentType == "plug"){
            targetPath = 'manage/addPlugs';
        }else{
            targetPath = 'manage/addContent';
        }
        if(state){
            res.render(targetPath, adminFunc.setPageInfo(req,res,settings.CONTENTLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })
});



//文章置顶
router.get('/manage/ContentList/topContent', function(req, res, next) {
    var params = url.parse(req.url,true);
    var contentId = params.query.uid;
    var isTop = Number(params.query.isTop);
    Content.update({_id : contentId}, {'isTop' : isTop}, function (err,result) {
        if(err) throw  err;
        res.end("success");
    })
});



//------------------------------------------文档分类管理开始
//文档类别列表页面
router.get('/manage/contentCategorys', function(req, res, next) {

    checkAdminPower(req,settings.CONTENTCATEGORYS,function(state){
        if(state){
            res.render('manage/contentCategorys', adminFunc.setPageInfo(req,res,settings.CONTENTCATEGORYS));
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//文章类别列表
router.get('/manage/contentCategorys/list', function(req, res, next) {
    return res.json(ContentCategory.find({}).sort({'sortId': 1}));
});

//添加新类别
function addOneCategory(req,res){
    var newObj = new ContentCategory(req.body);
    newObj.save(function(err){
        if(err){
            console.log(err);
        }else{
//            组合类别路径
            if(newObj.parentID == "0"){
                newObj.defaultUrl = newObj.homePage;
            }else{
                newObj.defaultUrl = newObj.defaultUrl + "/" +newObj.homePage;
            }
//            保存完毕存储父类别结构
            newObj.sortPath = newObj.sortPath + "," +newObj._id.toString();
            newObj.save(function(err){
                console.log('save new type ok!');
                res.end("success");
            });

        }
    });
}



//------------------------------------------文档标签开始

//文档标签管理（list）
router.get('/manage/contentTags', function(req, res, next) {

    checkAdminPower(req,settings.CONTENTTAGS,function(state){
        if(state){
            res.render('manage/contentTags', adminFunc.setPageInfo(req,res,settings.CONTENTTAGS));
        }else{
            res.redirect("/admin/manage");
        }
    })
});

//所有标签列表
router.get('/manage/contentTags/list', function(req, res, next) {
    DbOpt.findAll(ContentTags,req, res,"request ContentTags List")
});



//添加文档标签
function addOneContentTags(req,res){
    var errors;
    var name = req.body.name;
    var alias = req.body.alias;
    var query=ContentTags.find().or([{'name' : name},{alias : alias}]);
//    标签或别名不允许重复
    query.exec(function(err,tags){
        if(tags.length > 0){
            errors = "名称或者别名已存在！";
            res.end(errors);
        }else{
            DbOpt.addOne(ContentTags,req, res,"add new contentTags");
        }
    });
}


//------------------------------------------文档标签结束


//------------------------------------------文档模板开始

//文档模板管理（list）
router.get('/manage/contentTemps', function(req, res, next) {

    checkAdminPower(req,settings.CONTENTTEMPS,function(state){
        if(state){
            res.render('manage/contentTemps', adminFunc.setPageInfo(req,res,settings.CONTENTTEMPS));
        }else{
            res.redirect("/admin/manage");
        }
    })
});

//所有模板列表
router.get('/manage/contentTemps/list', function(req, res, next) {
    DbOpt.findAll(ContentTemplate,req, res,"request ContentTemps List")
});



//添加文档模板
function addOneContentTemps(req,res){
    var errors;
    var name = req.body.name;
    var alias = req.body.alias;
    var query=ContentTemplate.find().or([{'name' : name},{alias : alias}]);
//    模板或别名不允许重复
    query.exec(function(err,Temps){
        if(Temps.length > 0){
            errors = "名称或者别名已存在！";
            res.end(errors);
        }else{
            DbOpt.addOne(ContentTemplate,req, res,"add new contentTemps");
        }
    });
}




//读取模板文件夹信息
router.get('/manage/contentTemps/forderList', function(req, res, next) {

    var filePath = system.scanJustFolder(settings.TEMPSFOLDER);
//    对返回结果做初步排序
    filePath.sort(function(a,b){return a.type == "folder" ||  b.type == "folder"});

    return res.json(filePath);

});
//------------------------------------------文档模板结束





//------------------------------------------文档留言开始

//文档留言管理（list）
router.get('/manage/contentMsgs', function(req, res, next) {

    checkAdminPower(req,settings.MESSAGEMANAGE,function(state){
        if(state){
            res.render('manage/messageList', adminFunc.setPageInfo(req,res,settings.MESSAGEMANAGE));
        }else{
            res.redirect("/admin/manage");
        }
    })
});


//------------------------------------------文档留言结束




//------------------------------注册用户管理开始
//注册用户管理（list）
router.get('/manage/regUsersList', function(req, res, next) {

    checkAdminPower(req,settings.REGUSERSLIST,function(state){
        if(state){
            res.render('manage/regUsersList', adminFunc.setPageInfo(req,res,settings.REGUSERSLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});


//--------------------邮件模板开始---------------------------
//邮件模板列表页面
router.get('/manage/emailTempList', function(req, res, next) {

    checkAdminPower(req,settings.EMAILTEMPLIST,function(state){
        if(state){
            res.render('manage/emailTempList', adminFunc.setPageInfo(req,res,settings.EMAILTEMPLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});



//邮件模板添加页面
router.get('/manage/emailTemp/add', function(req, res, next) {

    checkAdminPower(req,settings.EMAILTEMPLIST,function(state){
        if(state){
            res.render('manage/addEmailTemp', adminFunc.setPageInfo(req,res,settings.EMAILTEMPLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//邮件模板编辑页面
router.get('/manage/emailTemp/edit/:content', function(req, res, next) {

    checkAdminPower(req,settings.EMAILTEMPLIST,function(state){
        if(state){
            res.render('manage/addEmailTemp', adminFunc.setPageInfo(req,res,settings.EMAILTEMPLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});



//--------------------广告管理开始---------------------------
//广告管理列表页面
router.get('/manage/adsList', function(req, res, next) {

    checkAdminPower(req,settings.ADSLIST,function(state){
        if(state){
            res.render('manage/adsList', adminFunc.setPageInfo(req,res,settings.ADSLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});



//广告添加页面
router.get('/manage/ads/add', function(req, res, next) {

    checkAdminPower(req,settings.ADSLIST,function(state){
        if(state){
            res.render('manage/addAds', adminFunc.setPageInfo(req,res,settings.ADSLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//广告编辑页面
router.get('/manage/ads/edit/:content', function(req, res, next) {

    checkAdminPower(req,settings.ADSLIST,function(state){
        if(state){
            res.render('manage/addAds', adminFunc.setPageInfo(req,res,settings.ADSLIST));
        }else{
            res.redirect("/admin/manage");
        }
    })

});




//--------------------系统管理首页开始---------------------------
//获取系统首页数据集合
router.get('/manage/getMainInfo', function(req, res, next) {
    adminFunc.setMainInfos(req, res);
});



module.exports = router;
