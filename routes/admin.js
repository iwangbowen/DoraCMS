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
//文章属性对象
var Types = require("../models/Types");
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
var System = require("../models/System");
//站点配置
var Settings = require("../models/db/settings");
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
                        if(cateName === key && newPowers[cateName]){
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
  res.render('manage/adminLogin', { title: Settings.SITETITLE , description : 'DoraCMS后台管理登录'});
});

// 管理员登录提交请求
router.post('/doLogin', function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var newPsd = DbOpt.encrypt(password,"dora");
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
  res.render('manage/main', { title: Settings.SITETITLE ,bigCategory : Settings.SYSTEMMANAGE ,description : 'DoraCMS后台管理',layout: 'adminTemp'});
});

//系统用户管理（list）
router.get('/manage/adminUsersList', function(req, res, next) {

    checkAdminPower(req,Settings.ADMINUSERLIST,function(state){
        if(state){
            var params = url.parse(req.url,true);
            var searchKey = params.query.searchKey;
            res.render('manage/adminUsersList', { title: Settings.SITETITLE ,bigCategory : Settings.ADMINUSERLIST,description : '用户管理',searchKey : searchKey,layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//请求系统管理员列表
router.get('/manage/adminUsersList/list', function(req, res, next) {

    DbOpt.findAll(AdminUser,req, res,"request adminUserList")
});

//查找指定管理用户
router.get('/manage/adminUsersList/user', function(req, res, next) {
    DbOpt.findOne(AdminUser,req, res,"find one adminUser","adminUser");
});

//根据条件查找管理用户列表
router.get('/manage/adminUsersList/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var keyPr = [];
    var reKey = new RegExp(keywords, 'i');
//    模糊查询名称和内容
    keyPr.push({'name' : { $regex: reKey } });
    keyPr.push({'username' : { $regex: reKey } });
    DbOpt.pagination(AdminUser,req, res,keyPr)
});

//系统管理员删除
router.get('/manage/adminUsersList/del', function(req, res, next) {
    DbOpt.del(AdminUser,req,res,"delAdminUser");
});

//添加系统用户
router.post('/manage/addAdminUser/add', function(req, res, next) {
    var errors;
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPsd = req.body.confirmPsd;
    var phoneNum = req.body.phoneNum;
    var email = req.body.email;
    var comments = req.body.comments;
    var group = req.body.group;

    AdminUser.findOne({username:username},function(err,user){
        if(user){
            errors = "该用户名已存在！"
            res.end(errors);
        }else{
            if(errors){
                res.end(errors)
            }else{
                //    密码加密
                var newPsd = DbOpt.encrypt(password,"dora");
                var adminUser = new AdminUser({
                    name : name,
                    username : username,
                    password : newPsd,
                    phoneNum : phoneNum,
                    email : email,
                    group : group,
                    comments : comments
                });
                adminUser.save();
                console.log("添加成功");
                res.end("success");
            }
        }
    })



});

//修改系统用户
router.post('/manage/addAdminUser/modify', function(req, res, next) {
    var password = req.body.password;
    var newPsd = DbOpt.encrypt(password,"dora");
    req.body.password = newPsd;
    DbOpt.updateOneByID(AdminUser,req, res,"modify adminUser");
});



//------------------------------------------系统用户管理结束

//------------------------------------------用户组管理面开始

//系统用户组管理（list）
router.get('/manage/adminGroupList', function(req, res, next) {

    checkAdminPower(req,Settings.ADMINGROUPLIST,function(state){

        if(state){
            res.render('manage/adminGroup', { title: Settings.SITETITLE ,bigCategory : Settings.ADMINGROUPLIST ,description : '用户组管理',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }

    })



});

//系统管理员用户组列表
router.get('/manage/adminGroupList/list', function(req, res, next) {
    DbOpt.findAll(AdminGroup,req, res,"request adminGroupList")
});

//根据条件查找管理用户组列表
router.get('/manage/adminGroupList/listByParam', function(req, res, next) {

    DbOpt.pagination(AdminGroup,req, res)

});

//添加系统用户组
router.post('/manage/addAdminGroup/add', function(req, res, next) {
    var name = req.body.name;
    var power = req.body.power;
    var adminGroup = new AdminGroup({
        name : name,
        power : power
    });
    adminGroup.save();
    console.log("添加用户组成功");
    res.end("success");
});

//查找指定用户组
router.get('/manage/adminGroup/item', function(req, res, next) {
    DbOpt.findOne(AdminGroup,req, res,"find one adminGroup")
});

//系统用户组删除
router.get('/manage/adminGroup/del', function(req, res, next) {
    DbOpt.del(AdminGroup,req,res,"delAdminGroup");

});

//修改系统用户组信息
router.post('/manage/addAdminGroup/modify', function(req, res, next) {
    DbOpt.updateOneByID(AdminGroup,req, res,"modify adminGroup");
});


//------------------------------------------用户组管理面结束

//------------------------------------------文件管理器开始

//文件管理界面（list）
router.get('/manage/filesList', function(req, res, next) {

    checkAdminPower(req,Settings.FILESLIST,function(state){
        if(state){
            res.render('manage/filesList', { title: Settings.SITETITLE ,bigCategory : Settings.FILESLIST ,description : '文件管理',layout: 'adminTemp'});
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
        path =  Settings.UPDATEFOLDER;
    }

//    var path = Settings.UPDATEFOLDER;
    var filePath = System.scanFolder(path);
//    对返回结果做初步排序
    filePath.sort(function(a,b){return a.type == "folder" ||  b.type == "folder"});

    return res.json({
        rootPath : Settings.UPDATEFOLDER,
        pathsInfo : filePath

    });

});

//文件删除
router.get('/manage/filesList/fileDel', function(req, res, next) {
    var params = url.parse(req.url,true);
    var path = params.query.filePath;
    if(path){
        System.deleteFolder(req, res, path);
    }
});

//文件重命名
router.post('/manage/filesList/fileReName', function(req, res, next) {
    var newPath = req.body.newPath;
    var path = req.body.path;
//    var path = params.query.filePath;
    if(path && newPath){
        System.reNameFile(req,res,path,newPath);
    }
});

//修改文件内容读取文件信息
router.get('/manage/filesList/getFileInfo', function(req, res, next) {

    var params = url.parse(req.url,true);
    var path = params.query.filePath;
    if(path){
        System.readFile(req,res,path);
    }
});

//修改文件内容更新文件信息
router.post('/manage/filesList/updateFileInfo', function(req, res, next) {

    var fileContent = req.body.code;
    var path = req.body.path;
    if(path){
        System.writeFile(req,res,path,fileContent);
    }
});

//------------------------------------------文件管理器结束


//------------------------------------------数据管理开始

router.get('/manage/dataManage/m/backUpData', function(req, res, next) {

    checkAdminPower(req,Settings.DATAMANAGE,function(state){
        if(state){
            res.render('manage/backUpData', { title: Settings.SITETITLE ,bigCategory : Settings.DATAMANAGE ,description : '数据管理',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })
});


//获取备份数据信息列表
router.get('/manage/backupDataManage/listByParam', function(req, res, next) {

    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var conditions = {};
    if(keywords){
        var reKey = new RegExp(keywords, 'i');
        conditions = {'logs' : { $regex: reKey} };
    }

    DbOpt.pagination(DataOptionLog,req, res,{})
});

//备份数据库执行
router.get('/manage/backupDataManage/backUp', function(req, res, next) {

    System.backUpData(res,req);

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
                System.deleteFolder(req, res,forderPath);
            }else{
                res.end("error");
            }

        }
    })

});

//------------------------------------------数据管理结束

//------------------------------------------文档组管理面开始
//文档列表页面
router.get('/manage/contentList', function(req, res, next) {

    checkAdminPower(req,Settings.CONTENTLIST,function(state){
        if(state){
            var params = url.parse(req.url,true);
            var searchKey = params.query.searchKey;
            res.render('manage/contentList', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '文档管理',searchKey : searchKey,layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//文档列表查询
router.get('/manage/contentList/list', function(req, res, next) {
    DbOpt.findAll(Content,req, res,"requestContentList")
});

//根据条件查找文档列表
router.get('/manage/contentList/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var conditions = {};
    if(keywords){
        var reKey = new RegExp(keywords, 'i');
        conditions = {'title' : { $regex: reKey} };
    }

    DbOpt.pagination(Content,req, res,conditions)
});


//文档添加页面(默认)
router.get('/manage/content/add/:key', function(req, res, next) {

    var contentType = req.params.key;
    checkAdminPower(req,Settings.CONTENTLIST,function(state){

        if(state){
            if(contentType == "film"){
                res.render('manage/addProduct', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '添加电影',layout: 'adminTemp'});
            }if(contentType == "plug"){
                res.render('manage/addPlugs', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '添加插件',layout: 'adminTemp'});
            }else{
                res.render('manage/addContent', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '添加文档',layout: 'adminTemp'});
            }
        }else{
            res.redirect("/admin/manage");
        }
    })
});



//文档编辑页面
router.get('/manage/content/edit/:type/:content', function(req, res, next) {
    var contentType = req.params.type;
    checkAdminPower(req,Settings.CONTENTLIST,function(state){
        if(state){
            if(contentType == "film"){
                res.render('manage/addProduct', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '修改电影',layout: 'adminTemp'});
            }if(contentType == "plug"){
                res.render('manage/addPlugs', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '修改插件',layout: 'adminTemp'});
            }else{
                res.render('manage/addContent', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTLIST ,description : '修改文档',layout: 'adminTemp'});
            }

        }else{
            res.redirect("/admin/manage");
        }
    })


});

//添加新文章
router.post('/manage/content/addcontent', function(req, res, next) {
    DbOpt.addOne(Content,req, res,"add new content")
});

//查找指定文章
router.get('/manage/content/item', function(req, res, next) {
    DbOpt.findOne(Content,req, res,"find one content")
});

//修改文章
router.post('/manage/content/modify', function(req, res, next) {
    DbOpt.updateOneByID(Content,req, res,"modify content");
});

//文章删除
router.get('/manage/ContentList/del', function(req, res, next) {
    DbOpt.del(Content,req,res,"delContent");
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

    checkAdminPower(req,Settings.CONTENTCATEGORYS,function(state){
        if(state){
            res.render('manage/contentCategorys', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTCATEGORYS ,description : '文档类别管理',layout: 'adminTemp'});
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
router.post('/manage/contentCategorys/add', function(req, res, next) {

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
                console.log('save new type ok!')
            });
            res.end("success");
        }
    });
});

//类别删除
router.get('/manage/contentCategorys/del', function(req, res, next) {
    DbOpt.del(ContentCategory,req,res,"delContent");
});

//查找指定类别
router.get('/manage/contentCategorys/item', function(req, res, next) {
    DbOpt.findOne(ContentCategory,req, res,"find one contentCategory")
});

//修改指定分类
router.post('/manage/contentCategorys/modify', function(req, res, next) {
    DbOpt.updateOneByID(ContentCategory,req, res,"modify adminGroup");
});


//------------------------------------------文档标签开始

//文档标签管理（list）
router.get('/manage/contentTags', function(req, res, next) {

    checkAdminPower(req,Settings.CONTENTTAGS,function(state){

        if(state){
            res.render('manage/contentTags', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTTAGS ,description : '标签管理',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })
});

//所有标签列表
router.get('/manage/contentTags/list', function(req, res, next) {
    DbOpt.findAll(ContentTags,req, res,"request ContentTags List")
});


//根据条件查找文档标签列表
router.get('/manage/contentTags/listByParam', function(req, res, next) {

    DbOpt.pagination(ContentTags,req, res)

});

//添加文档标签
router.post('/manage/addContentTags/add', function(req, res, next) {
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

});

//查找指定文档标签
router.get('/manage/contentTags/item', function(req, res, next) {
    DbOpt.findOne(ContentTags,req, res,"find one adminGroup")
});

//文档标签删除
router.get('/manage/contentTags/del', function(req, res, next) {
    DbOpt.del(ContentTags,req,res,"delAdminGroup");

});

//修改文档标签信息
router.post('/manage/addContentTags/modify', function(req, res, next) {
    DbOpt.updateOneByID(ContentTags,req, res,"modify adminGroup");
});

//------------------------------------------文档标签结束


//------------------------------------------文档模板开始

//文档模板管理（list）
router.get('/manage/contentTemps', function(req, res, next) {

    checkAdminPower(req,Settings.CONTENTTEMPS,function(state){

        if(state){
            res.render('manage/contentTemps', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTTEMPS ,description : '文档模板管理',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })
});

//所有模板列表
router.get('/manage/contentTemps/list', function(req, res, next) {
    DbOpt.findAll(ContentTemplate,req, res,"request ContentTemps List")
});


//根据条件查找文档模板列表
router.get('/manage/contentTemps/listByParam', function(req, res, next) {

    DbOpt.pagination(ContentTemplate,req, res)

});

//添加文档模板
router.post('/manage/addContentTemps/add', function(req, res, next) {
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

});

//查找指定文档模板
router.get('/manage/contentTemps/item', function(req, res, next) {
    DbOpt.findOne(ContentTemplate,req, res,"find one contentTemps")
});

//文档模板删除
router.get('/manage/contentTemps/del', function(req, res, next) {
    DbOpt.del(ContentTemplate,req,res,"del contentTemps");

});

//修改文档模板信息
router.post('/manage/addContentTemps/modify', function(req, res, next) {
    DbOpt.updateOneByID(ContentTemplate,req, res,"modify contentTemps");
});


//读取模板文件夹信息
router.get('/manage/contentTemps/forderList', function(req, res, next) {

    var filePath = System.scanJustFolder(Settings.TEMPSFOLDER);
//    对返回结果做初步排序
    filePath.sort(function(a,b){return a.type == "folder" ||  b.type == "folder"});

    return res.json(filePath);

});
//------------------------------------------文档模板结束




//------------------------------------------文档属性开始

//文档属性管理（list）
router.get('/manage/contentAttributes/m/:types', function(req, res, next) {

    var thisType = req.params.types;
    var typeId = 0;
    var typeName = "默认";
    if(thisType == "fileType"){
        typeId = 0;
        typeName = "影视类型";
    }else if(thisType == "locations"){
        typeId = 1;
        typeName = "国家地区";
    }
    else if(thisType == "years"){
        typeId = 2;
        typeName = "年份属性";
    }
    checkAdminPower(req,Settings.CONTENTTYPES,function(state){

        if(state){
            res.render('manage/contentAttributes', { title: Settings.SITETITLE ,bigCategory : Settings.CONTENTTYPES ,thisType : typeId ,description : '文档属性管理--'+typeName,layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })
});

//所有属性列表
router.get('/manage/contentAttributes/list', function(req, res, next) {
    DbOpt.findAll(Types,req, res,"request contentAttributes List")
});


//根据条件查找文档属性列表带分页
router.get('/manage/contentAttributes/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    DbOpt.pagination(Types,req, res,{'type': Number(keywords)})

});

//条件查询指定类别的分类，不带分页
//router.get('/manage/contentAttributes/allByParam', function(req, res, next) {
//    var params = url.parse(req.url,true);
//    var keywords = params.query.typeId;
//    var typeList = DbOpt.getDatasByParam(Types,req, res,{'type': Number(keywords)})
//    return res.json(typeList)
//
//});

//添加文档属性
router.post('/manage/addContentAttributes/add', function(req, res, next) {
    var errors;
    var name = req.body.name;
    var alias = req.body.alias;
    var query=Types.find({'name' : name});
//    模板或别名不允许重复
    query.exec(function(err,Temps){
        if(Temps.length > 0){
            errors = "名称或者别名已存在！";
            res.end(errors);
        }else{
            DbOpt.addOne(Types,req, res,"add new contentAttributes");
        }
    });

});

//查找指定文档属性
router.get('/manage/contentAttributes/item', function(req, res, next) {
    DbOpt.findOne(Types,req, res,"find one contentAttributes")
});

//文档属性删除
router.get('/manage/contentAttributes/del', function(req, res, next) {
    DbOpt.del(Types,req,res,"del contentAttributes");

});

//修改文档属性信息
router.post('/manage/addContentAttributes/modify', function(req, res, next) {
    DbOpt.updateOneByID(Types,req, res,"modify contentAttributes");
});


//------------------------------------------文档模板结束


//------------------------------------------文档留言开始

//文档留言管理（list）
router.get('/manage/contentMsgs', function(req, res, next) {

    checkAdminPower(req,Settings.MESSAGEMANAGE,function(state){

        if(state){
            res.render('manage/messageList', { title: Settings.SITETITLE ,bigCategory : Settings.MESSAGEMANAGE ,description : '用户留言管理',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })
});

//所有留言列表
router.get('/manage/contentMsgs/list', function(req, res, next) {
    DbOpt.findAll(Message,req, res,"request ContentMsgs List")
});


//根据条件查找文档留言列表
router.get('/manage/contentMsgs/listByParam', function(req, res, next) {

    DbOpt.pagination(Message,req, res)

});


//查找指定文档留言
router.get('/manage/contentMsgs/item', function(req, res, next) {
    DbOpt.findOne(Message,req, res,"find one Msg")
});

//文档留言删除
router.get('/manage/contentMsgs/del', function(req, res, next) {
    var params = url.parse(req.url,true);
    Message.remove({_id : params.query.uid},function(err,result){
        if(err){
            res.end(err);
        }else{
//            删除留言同时更新留言总数
            var contentId = result.contentId;
            Content.findOne({_id : contentId},function(err,contentObj){
                if(err){
                    res.end(err);
                }else{
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
    })

});



//------------------------------------------文档留言结束




//------------------------------注册用户管理开始
//注册用户管理（list）
router.get('/manage/regUsersList', function(req, res, next) {

    checkAdminPower(req,Settings.REGUSERSLIST,function(state){
        if(state){
            var params = url.parse(req.url,true);
            var searchKey = params.query.searchKey;
            res.render('manage/regUsersList', { title: Settings.SITETITLE ,bigCategory : Settings.REGUSERSLIST ,description : '注册用户管理',searchKey : searchKey,layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//请求注册用户列表
router.get('/manage/regUsersList/list', function(req, res, next) {

    DbOpt.findAll(User,req, res,"request regUserList")
});

//根据条件注册用户列表
router.get('/manage/regUsersList/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var keyPr = []
    var reKey = new RegExp(keywords, 'i');
//    模糊查询名称和内容
    keyPr.push({'name' : { $regex: reKey } });
    keyPr.push({'userName' : { $regex: reKey } });
    DbOpt.pagination(User,req, res,keyPr)
});

//查找指定注册用户
router.get('/manage/regUsersList/user', function(req, res, next) {
    var params = url.parse(req.url,true);
    var currentId = (params.query.uid).split('.')[0];
    User.findOne({_id : currentId}, function (err,result) {
        if(err){

        }else{
//                针对有密码的记录，需要解密后再返回
            if(result.password){
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

//注册用户删除
router.get('/manage/regUsersList/del', function(req, res, next) {
    DbOpt.del(User,req,res,"delregUser");
});


//修改注册用户
router.post('/manage/addRegUser/modify', function(req, res, next) {
    var password = req.body.password;
    var newPsd = DbOpt.encrypt(password,"dora");
    req.body.password = newPsd;
    DbOpt.updateOneByID(User,req, res,"modify regUser");
});

//--------------------邮件模板开始---------------------------
//邮件模板列表页面
router.get('/manage/emailTempList', function(req, res, next) {

    checkAdminPower(req,Settings.EMAILTEMPLIST,function(state){
        if(state){
            var params = url.parse(req.url,true);
            var searchKey = params.query.searchKey;
            res.render('manage/emailTempList', { title: Settings.SITETITLE ,bigCategory : Settings.EMAILTEMPLIST ,description : '邮件模板管理',searchKey : searchKey,layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//邮件模板列表查询
router.get('/manage/emailTempList/list', function(req, res, next) {
    DbOpt.findAll(EmailTemp,req, res,"requestContentList")
});

//根据条件查找邮件模板列表
router.get('/manage/emailTempList/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var conditions = {};
    if(keywords){
        var reKey = new RegExp(keywords, 'i');
        conditions = {'title' : { $regex: reKey} };
    }
    DbOpt.pagination(EmailTemp,req, res,conditions)
});

//邮件模板添加页面
router.get('/manage/emailTemp/add', function(req, res, next) {

    checkAdminPower(req,Settings.EMAILTEMPLIST,function(state){
        if(state){
            res.render('manage/addEmailTemp', { title: Settings.SITETITLE ,bigCategory : Settings.EMAILTEMPLIST ,description : '添加邮件模板',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//邮件模板编辑页面
router.get('/manage/emailTemp/edit/:content', function(req, res, next) {

    checkAdminPower(req,Settings.EMAILTEMPLIST,function(state){
        if(state){
            res.render('manage/addEmailTemp', { title: Settings.SITETITLE ,bigCategory : Settings.EMAILTEMPLIST ,description : '修改邮件模板',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//添加新邮件模板
router.post('/manage/emailTemp/addEmailTemp', function(req, res, next) {

    DbOpt.addOne(EmailTemp,req, res,"add new EmailTemp")
});

//查找指定邮件模板
router.get('/manage/emailTemp/item', function(req, res, next) {
    DbOpt.findOne(EmailTemp,req, res,"find one EmailTemp")
});

//修改邮件模板
router.post('/manage/emailTemp/modify', function(req, res, next) {
    DbOpt.updateOneByID(EmailTemp,req, res,"modify EmailTemp");
});

//邮件模板删除
router.get('/manage/emailTempList/del', function(req, res, next) {
    DbOpt.del(EmailTemp,req,res,"delEmailTemp");
});


//--------------------广告管理开始---------------------------
//广告管理列表页面
router.get('/manage/adsList', function(req, res, next) {

    checkAdminPower(req,Settings.ADSLIST,function(state){
        if(state){
            var params = url.parse(req.url,true);
            var searchKey = params.query.searchKey;
            res.render('manage/adsList', { title: Settings.SITETITLE ,bigCategory : Settings.ADSLIST ,description : '广告管理',searchKey : searchKey,layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//广告列表查询
router.get('/manage/adsList/list', function(req, res, next) {
    DbOpt.findAll(Ads,req, res,"requestContentList")
});

//根据条件查找广告列表
router.get('/manage/adsList/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var conditions = {};
    if(keywords){
        var reKey = new RegExp(keywords, 'i');
        conditions = {'title' : { $regex: reKey} };
    }
    DbOpt.pagination(Ads,req, res,conditions)
});

//广告添加页面
router.get('/manage/ads/add', function(req, res, next) {

    checkAdminPower(req,Settings.ADSLIST,function(state){
        if(state){
            res.render('manage/addAds', { title:Settings.SITETITLE ,bigCategory : Settings.ADSLIST ,description : '添加广告',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//广告编辑页面
router.get('/manage/ads/edit/:content', function(req, res, next) {

    checkAdminPower(req,Settings.ADSLIST,function(state){
        if(state){
            res.render('manage/addAds', { title: Settings.SITETITLE ,bigCategory : Settings.ADSLIST ,description : '修改广告',layout: 'adminTemp'});
        }else{
            res.redirect("/admin/manage");
        }
    })


});

//添加新广告
router.post('/manage/ads/addAdds', function(req, res, next) {

    DbOpt.addOne(Ads,req, res,"add new Adds")
});

//查找指定广告
router.get('/manage/ads/item', function(req, res, next) {
    DbOpt.findOne(Ads,req, res,"find one Adds")
});

//修改广告
router.post('/manage/ads/modify', function(req, res, next) {
    DbOpt.updateOneByID(Ads,req, res,"modify Adds");
});

//广告删除
router.get('/manage/ads/del', function(req, res, next) {
    DbOpt.del(Ads,req,res,"delAdds");
});

//--------------------系统管理首页开始---------------------------
//获取系统管理员数量信息
router.get('/manage/getAdminCount', function(req, res, next) {
    var conditions = {};
    DbOpt.getCount(AdminUser,req, res,conditions);
});

//获取注册用户数量信息
router.get('/manage/getRegUsersCount', function(req, res, next) {
    var conditions = {};
    DbOpt.getCount(User,req, res,conditions);
});

//获取文档数量信息
router.get('/manage/getContentsCount', function(req, res, next) {
    var conditions = {};
    DbOpt.getCount(Content,req, res,conditions);
});

module.exports = router;
