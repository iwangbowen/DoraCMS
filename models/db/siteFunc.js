/**
 * Created by Administrator on 2015/5/30.
 */
// 文档对象
var Content = require("../Content");
//文章类别对象
var ContentCategory = require("../ContentCategory");
//文章标签对象
var ContentTags = require("../ContentTags");
var Settings = require("./settings");
//数据库操作对象
var DbOpt = require("../Dbopt");
function isLogined(req) {
    return req.session.logined;
}

var siteFunc = {

    siteInfos: function (title, cmsDescription, keyWords) {
        var discrip;
        var key;

        if (cmsDescription) {
            discrip = cmsDescription;
        } else {
            discrip = Settings.CMSDISCRIPTION;
        }

        if (keyWords) {
            key = keyWords + ',' + Settings.SITEBASICKEYWORDS;
        } else {
            key = Settings.SITEKEYWORDS;
        }

        return {
            title: title + " | " + Settings.SITETITLE,
            cmsDescription: discrip,
            keywords: key,
            siteIcp: Settings.SITEICP
        }
    },

    getCategoryList : function(){
        return ContentCategory.find({'parentID': '0','state' : '1'},'name defaultUrl').sort({'sortId': 1}).find();
    },

    getHotItemListData : function(q){
        return Content.find(q,'stitle').sort({'clickNum': -1}).skip(0).limit(15);
    },

    setDataForIndex: function (req, res, q, title) {
        var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, q , requireField);
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos("首页"),
            documentList: documentList.docs,
            hotItemListData: siteFunc.getHotItemListData({}),
            cateTypes: siteFunc.getCategoryList(),
            cateInfo: '',
            tagsData: tagsData,
            pageInfo: documentList.pageInfo,
            pageType: 'index',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

    setDataForCate: function (req, res, dq, cq, cateInfo) {
        var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, dq , requireField);
        var currentCateList = ContentCategory.find(cq).sort({'sortId': 1});
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos(cateInfo.name, cateInfo.comments, cateInfo.keywords),
            documentList: documentList.docs,
            currentCateList: currentCateList,
            hotItemListData: siteFunc.getHotItemListData(dq),
            tagsData: tagsData,
            cateInfo: cateInfo,
            cateTypes: siteFunc.getCategoryList(),
            pageInfo: documentList.pageInfo,
            pageType: 'cate',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

    setDetailInfo: function (req, res, cateQuery, docs) {
        var currentCateList = ContentCategory.find(cateQuery).sort({'sortId': 1});
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos(docs.title, docs.discription, docs.keywords),
            cateTypes: siteFunc.getCategoryList(),
            currentCateList: currentCateList,
            hotItemListData: siteFunc.getHotItemListData({}),
            tagsData: tagsData,
            documentInfo: docs,
            pageType: 'detail',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

    setDataForSearch: function (req, res, q, searchKey) {
        req.query.searchKey = searchKey;
        var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, q , requireField);
        return {
            siteConfig: siteFunc.siteInfos("文档搜索"),
            documentList: documentList.docs,
            cateTypes: siteFunc.getCategoryList(),
            cateInfo: '',
            pageInfo: documentList.pageInfo,
            pageType: 'search',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

    setDataForError: function (req, res, title, errInfo) {
        return {
            siteConfig: siteFunc.siteInfos(title),
            cateTypes: siteFunc.getCategoryList(),
            errInfo: errInfo,
            pageType: 'error',
            logined: isLogined(req),
            layout: 'web/public/defaultTemp'
        }
    },

    setDataForUser : function (req, res, title) {
        return {
            siteConfig : siteFunc.siteInfos(title) ,
            cateTypes : siteFunc.getCategoryList(),
            userInfo : req.session.userInfo,
            layout: 'web/public/defaultTemp'
        }
    }
};


module.exports = siteFunc;