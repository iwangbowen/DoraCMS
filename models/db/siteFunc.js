/**
 * Created by Administrator on 2015/5/30.
 */
// 文档对象
var Content = require("../Content");
//文章类别对象
var ContentCategory = require("../ContentCategory");
//文章标签对象
var ContentTags = require("../ContentTags");
//广告对象
var Ads = require("../Ads");
var Settings = require("./settings");
//数据库操作对象
var DbOpt = require("../Dbopt");
//时间格式化
var moment = require('moment');
//缓存
var cache = require('../../util/cache');
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

    getFriendLink : function(){
       return Ads.find({'category' : 'friendlink'});
    },

    setDataForIndex: function (req, res, q, title) {
        var requireField = 'title date commentNum discription sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, q , requireField);
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: siteFunc.siteInfos("首页"),
            documentList: documentList.docs,
            hotItemListData: siteFunc.getHotItemListData({}),
            friendLinkData : siteFunc.getFriendLink(),
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
            friendLinkData : siteFunc.getFriendLink(),
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
            friendLinkData : siteFunc.getFriendLink(),
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

    setDataForUser: function (req, res, title) {
        return {
            siteConfig: siteFunc.siteInfos(title),
            cateTypes: siteFunc.getCategoryList(),
            userInfo: req.session.user,
            layout: 'web/public/defaultTemp'
        }
    },

    setDataForSiteMap: function (req, res) {

        var root_path = 'http://www.html-js.cn/';
        var priority = 0.8;
        var freq = 'weekly';
        var lastMod = moment().format('YYYY-MM-DD');
        var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        xml += '<url>';
        xml += '<loc>' + root_path + '</loc>';
        xml += '<changefreq>daily</changefreq>';
        xml += '<lastmod>' + lastMod + '</lastmod>';
        xml += '<priority>' + 0.8 + '</priority>';
        xml += '</url>';
        cache.get('sitemap', function(siteMapData){
            if(siteMapData){ // 缓存已建立
                res.end(siteMapData);
            }else{
                ContentCategory.find({}, 'defaultUrl', function (err, cates) {
                    if (err) {
                        console.log(err);
                    } else {
                        cates.forEach(function (cate) {
                            xml += '<url>';
                            xml += '<loc>' + root_path + cate.defaultUrl + '___' + cate._id + '</loc>';
                            xml += '<changefreq>weekly</changefreq>';
                            xml += '<lastmod>' + lastMod + '</lastmod>';
                            xml += '<priority>0.5</priority>';
                            xml += '</url>';
                        });

                        Content.find({}, 'title', function (err, contentLists) {
                            if (err) {
                                console.log(err);
                            } else {
                                contentLists.forEach(function (post) {
                                    xml += '<url>';
                                    xml += '<loc>' + root_path + 'details/' + post._id + '.html</loc>';
                                    xml += '<changefreq>Monthly</changefreq>';
                                    xml += '<lastmod>' + lastMod + '</lastmod>';
                                    xml += '<priority>0.5</priority>';
                                    xml += '</url>';
                                });
                                xml += '</urlset>';
                                // 缓存一天
                                cache.set('sitemap', xml, 1000 * 3600 * 2);
                                res.end(xml);
                            }
                        })
                    }

                })
            }
        })

    }
};


module.exports = siteFunc;