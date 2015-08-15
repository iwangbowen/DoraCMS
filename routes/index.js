var express = require('express');
var router = express.Router();

//数据库操作对象
var DbOpt = require("../models/Dbopt");
// 文档对象
var Content = require("../models/Content");
//文章类别对象
var ContentCategory = require("../models/ContentCategory");
//短id
var shortid = require('shortid');
//时间格式化
var moment = require('moment');
//站点配置
var Settings = require("../models/db/settings");
var siteFunc = require("../models/db/siteFunc");
var url = require('url');


function isLogined(req){
    return req.session.logined;
}

//分类页面路由设置
function queryCatePage(req, res,folder,cateId){

    ContentCategory.findOne({"_id" : cateId}, function (err,result) {
        if(err){
            console.log("-err-"+err);
            res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败")});

        }else{
//            查询该类别的顶级类别ID
            if(result){
                var isDetail = true;
                var temp = result.contentTemp;
                if(temp == 'blog'){
                    isDetail = false;
                }
                var q = {};
                var params = url.parse(req.url,true);
                if(params){
                    var cateIdKey = new RegExp(result._id, 'i');

                    var sort = params.query.sort;
                    var time = Number(params.query.time);
                    var searchKey = '';

                    if(params.query.search){
                        searchKey = new RegExp(params.query.search, 'i')
                    }

                    if(!time){
                        time = 'all';
                        q = {'sortPath' : { $regex: cateIdKey },'comments' : { $regex: searchKey }}
                    }else{
                        moment.locale('en');
                        var newTime = moment(new Date()).subtract(time, 'days').calendar();
                        q = {'sortPath' : { $regex: cateIdKey },'comments' : { $regex: searchKey },'date' : {$gt:newTime}}
                    }

                    if(!sort){
                        sort = 'date';
                        req.query.order = 'date_-1';
                    }else{
                        req.query.order = sort+'_-1';
                    }

                }

//                返回数据初始化
//                req.query.limit = 2;
                req.query.sort = sort;
                req.query.time = time;
                req.query.searchKey = params.query.search;

                var detailListInfo = DbOpt.getPaginationResult(Content,req, res,q);

                res.render('web/temp/'+result.contentTemp+'/contentList', {
                    siteConfig : siteFunc.siteInfos(result.name,result.comments,result.keywords,isDetail) ,
                    cateInfo : result,
                    detaillistData : detailListInfo.docs,
                    pageInfo : detailListInfo.pageInfo,
                    cateTypes : ContentCategory.find({}).sort({'sortId': 1}).find(),
                    logined:isLogined(req)
                });
            }
            else{
                res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败") });
            }
        }
    })
}


//首页分页
function queryIndexPage(req, res){
    var q = {};
    var params = url.parse(req.url,true);
    if(params){

        var sort = params.query.sort;
        var time = Number(params.query.time);
        var searchKey = new RegExp(params.query.search, 'i');

        if(!time){
            time = 'all';
            q = {'type' : 'content','comments' : { $regex: searchKey }}
        }else{
            moment.locale('en');
            var newTime = moment(new Date()).subtract(time, 'days').calendar();
            q = {'type' : 'content' , 'comments' : { $regex: searchKey },'date' : {$gt:newTime}}
        }

        if(!sort){
            sort = 'date';
            req.query.order = 'date_-1';
        }else{
            req.query.order = sort+'_-1';
        }
    }

//    req.query.limit = 2;
    req.query.sort = sort;
    req.query.time = time;
    req.query.searchKey = params.query.search;

    var detailList = DbOpt.getPaginationResult(Content,req, res,q);
    res.render('index', {
        siteConfig : siteFunc.siteInfos("首页"),
        detaillistData : detailList.docs,
        cateTypes : ContentCategory.find({}).sort({'sortId': 1}).find(),
        pageInfo : detailList.pageInfo,
        logined:isLogined(req),
        temp:"ui",
        layout: 'web/temp/indexTemp' });
}

/* GET home page. */
router.get('/', function(req, res, next) {
    queryIndexPage(req, res);
});

//站点地图
router.get("/sitemap.html", function(req, res, next) {

    res.render('sitemap', {
        siteConfig : siteFunc.siteInfos("站点地图",'','',true),
        cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}).find(),
        details : Content.find({}),
        updateTime : moment().format('YYYY-MM-DD HH:mm:ss'),
        pageInfo : '',
        logined:isLogined(req),
        layout: 'web/temp/indexTemp' });
});


//文档详情页面
router.get('/details/:url', function(req, res, next) {

    var url = req.params.url;
    var currentId = url.split('.')[0];
    Content.findOne({ '_id': currentId },  function (err, result) {
        if(err){
            console.log(err)
        }else{
            if(result){

                Content.find({'type' : 'content'}).count(function(err,count){
                    var randomNum = Math.floor(count*Math.random());
                    var randomList = Content.find({'type' : 'content'}).sort({'date':-1}).skip(randomNum).limit(4);
                    res.render('web/temp/'+result.contentTemp+'/detail', {
                        siteConfig : siteFunc.siteInfos(result.title,result.discription,result.keywords,true) ,
                        cateTypes : ContentCategory.find({}).sort({'sortId': 1}).find(),
                        detailInfo : result,
                        randomList : randomList,
                        contentId :url
                    });
                });


            }else{
                res.render('web/do404', { siteConfig : siteFunc.siteInfos("操作失败")});
            }
        }
    });
});




//分类列表页面  http://127.0.0.1/DoraCms___VylIn1IU-1.html
router.get('/:defaultUrl', function(req, res, next) {

    var defaultUrl = req.params.defaultUrl;
    var folder = defaultUrl.split('___')[0];
    var url = defaultUrl.split('___')[1];

    var indexUrl = defaultUrl.split('—')[0];
    var indexPage = defaultUrl.split('—')[1];
    if(indexUrl == 'page'){ // 首页的分页
        req.query.page = indexPage;
        queryIndexPage(req, res);
    }else{
        var currentUrl = url;
        if(url.indexOf("—")>=0){
            currentUrl = url.split("—")[0];
            req.query.page = (url.split("—")[1]).split(".")[0];
        }
        queryCatePage(req, res,folder,currentUrl);
    }

});

//分类列表页面  http://127.0.0.1/DoraCms___VylIn1IU-1.html
router.get('/:forder/:defaultUrl', function(req, res, next) {

    var defaultUrl = req.params.defaultUrl;

    var folder = defaultUrl.split('___')[0];
    var url = defaultUrl.split('___')[1];

    var currentUrl = url;
    if(url.indexOf("—")>=0){
        currentUrl = url.split("—")[0];
        req.query.page = (url.split("—")[1]).split(".")[0];
    }

    queryCatePage(req, res,folder,currentUrl);

});




module.exports = router;
