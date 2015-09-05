/**
 * Created by Administrator on 2015/8/31.
 */
var url = require('url');
var Settings = require("./settings");
//数据库操作对象
var DbOpt = require("../Dbopt");

//管理员对象
var AdminUser = require("../AdminUser");
//管理员用户组对象
var AdminGroup = require("../AdminGroup");
// 文档对象
var Content = require("../Content");
//数据操作日志
var DataOptionLog = require("../DataOptionLog");
//文章类别对象
var ContentCategory = require("../ContentCategory");
//文章标签对象
var ContentTags = require("../ContentTags");
//文章模板对象
var ContentTemplate = require("../ContentTemplate");
//文章留言对象
var Message = require("../Message");
//注册用户对象
var User = require("../User");
//邮件模板对象
var EmailTemp = require("../EmailTemp");
//广告对象
var Ads = require("../Ads");
//文件对象
var Files = require("../Files");

var adminFunc = {

    siteInfos : function (description) {

        return {
            title : Settings.SITETITLE,
            description : description
        }
    },

    setMainInfos : function(req, res){
        return res.json({
            adminUserCount : AdminUser.count({}),
            regUsersCount : User.count({}),
            contentsCount : Content.count({}),
            msgCount : Message.count({})
        })
    },

    setPageInfo : function(req,res,module){

        var searchKey = '';

        if(req.url){
            var params = url.parse(req.url,true);
            searchKey = params.query.searchKey;
        }

        return {
            siteInfo : adminFunc.siteInfos(module[1]),
            bigCategory : module[0],
            searchKey : searchKey,
            layout : 'manage/public/adminTemp'
        }

    },

    setDataForManageList: function (req, res, q, title) {
        var requireField = '';
        var documentList = DbOpt.getPaginationResult(Content, req, res, q , requireField);

        return {

            documentList: documentList.docs,
            pageInfo: documentList.pageInfo,
            pageType: 'index'

        }
    }
    ,
    getTargetObj : function(currentPage){
        var targetObj;

        if(currentPage == Settings.ADMINUSERLIST[0]){
            targetObj = AdminUser;
        }else if(currentPage == Settings.ADMINGROUPLIST[0]){
            targetObj = AdminGroup;
        }else if(currentPage == Settings.EMAILTEMPLIST[0]){
            targetObj = EmailTemp;
        }else if(currentPage == Settings.ADSLIST[0]){
            targetObj = Ads;
        }else if(currentPage == Settings.FILESLIST[0]){
            targetObj = Files;
        }else if(currentPage == Settings.DATAMANAGE[0]){
            targetObj = DataOptionLog;
        }else if(currentPage == Settings.CONTENTLIST[0]){
            targetObj = Content;
        }else if(currentPage == Settings.CONTENTCATEGORYS[0]){
            targetObj = ContentCategory;
        }else if(currentPage == Settings.CONTENTTAGS[0]){
            targetObj = ContentTags;
        }else if(currentPage == Settings.CONTENTTEMPS[0]){
            targetObj = ContentTemplate;
        }else if(currentPage == Settings.MESSAGEMANAGE[0]){
            targetObj = Message;
        }else if(currentPage == Settings.REGUSERSLIST[0]){
            targetObj = User;
        }else{
            targetObj = Content;
        }

        return targetObj
    }


};


module.exports = adminFunc;