var express = require('express');
var router = express.Router();

/* GET home page. */
//文章类别对象
var ContentCategory = require("../models/ContentCategory");
//数据库操作对象
var DbOpt = require("../models/Dbopt");
// 文档对象
var Content = require("../models/Content");
//文章标签对象
var ContentTags = require("../models/ContentTags");
//留言对象
var Message = require("../models/Message");
//广告对象
var Ads = require("../models/Ads");
//站点配置
var Settings = require("../models/db/settings");
var siteFunc = require("../models/db/siteFunc");

var url = require('url');
//二维码对象
var qr = require('qr-image')

//判断是否登录
function isLogined(req){
    return req.session.logined;
}



//文档查询
router.get('/searchResult/items', function(req, res, next) {

    var params = url.parse(req.url,true);
    var searchKey = params.query.searchKey;
    var area = params.query.area;
    if(!area){
        area = "content"; // 默认搜索文档
    }
    res.render('web/searchResult', {
        siteConfig : siteFunc.siteInfos("文档搜索") ,
        cateTypes : ContentCategory.find({'parentID' : '0'}).sort({'sortId': 1}),
        logined:isLogined(req),
        searchKey : searchKey,
        searchArea : area,
        layout: 'web/temp/searchTemp'
    });
});

//条件查询文章列表
router.get('/searchResult/list', function(req, res, next) {
    var params = url.parse(req.url,true);
    var keywords = params.query.keywords;
    var area = params.query.area;
    var keyPr;
    var reKey = new RegExp(keywords, 'i');
//    模糊查询名称和内容
    if(area === "tags"){
        keyPr = {'tags' : { $regex: reKey } };
    }else{
        keyPr = [];
        keyPr.push({'comments' : { $regex: reKey } });
        keyPr.push({'tags' : { $regex: reKey } });
        keyPr.push({'title' : { $regex: reKey } })
    }

    DbOpt.pagination(Content,req, res,keyPr);

});


//查询指定类别的文章分类
router.get('/contentCategorys/listParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    DbOpt.findListByParams(ContentCategory,req, res,params);
});

//文章类别列表
router.get('/contentCategorys/list', function(req, res, next) {
    DbOpt.findAll(ContentCategory,req, res,"request Content Category List")
});

//查找指定文章
router.get('/content/item', function(req, res, next) {

    DbOpt.findOne(Content,req, res,"find one content")
});

// 更新访问量
router.get('/clickNum/update',function(req, res, next){
    var params = url.parse(req.url,true);
    var clickNum = Number(params.query.clickNum);
    if(clickNum){
        clickNum = clickNum + 1;
        Content.update({_id : params.query.uid}, {$set:{clickNum:clickNum}}, function (err,result) {
            if(err){

            }else{
                res.end("success");
            }
        })
    }
});


// 更新喜欢文章数据
router.get('/ilike/update',function(req, res, next){

    var params = url.parse(req.url,true);
    var contentId = params.query.contentId;
    var uid = params.query.uid;

    var likeNum = 0;
    Content.findOne({_id : contentId},function(err,contentObj){
        if(err){
            console.log(err);
        }else{
            var oldUids = contentObj.likeUserIds;
            var newUIds;
            if(oldUids){
                var hasLike;
                var idsArr = oldUids.split(',');
                for(var i=0;i<idsArr.length;i++){
                    if(idsArr[i] == uid){
                        hasLike = 1;
                        break;
                    }else{
                        hasLike = 0;
                    }
                }

                if(hasLike == 1){
                    if(oldUids.indexOf(uid+',')>=0){
                        newUIds = oldUids.replace(uid+',','');
                    }else{
                        newUIds = oldUids.replace(uid,'');
                    }
                }else{
                    newUIds = oldUids + ',' + uid;
                }

            }else{
                newUIds = uid;
            }

            if(newUIds){
                likeNum = (newUIds.split(',')).length;
            }

            contentObj.likeNum = likeNum;
            contentObj.likeUserIds = newUIds;
            contentObj.save(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.end(likeNum.toString());
                }
            });
        }
    });

});

//留言点赞
router.get('/iPraise/update', function(req, res, next) {
    var params = url.parse(req.url,true);
    var msgId = params.query.msgId;
    var uid = params.query.uid;
    Message.findOne({_id : msgId},function(err,msgObj){
        if(err){
            res.end(err);
        }else{
            msgObj.praiseNum = msgObj.praiseNum + 1;
            var praiseMembers = msgObj.praiseMembers;
            if(praiseMembers){
                msgObj.praiseMembers = praiseMembers + ',' + uid;
            }else{
                msgObj.praiseMembers = uid;
            }
            msgObj.save(function(err){
                if(err){
                    res.end(err);
                }else{
                    res.end((msgObj.praiseNum).toString());
                }
            })
        }
    })
});

//文章二维码生成
router.get('/qrImg/show', function(req, res, next) {
    var params = url.parse(req.url,true);
    var detailLink = params.query.detailLink;
    try {
        var img = qr.image(detailLink,{size :10});
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
    } catch (e) {
        res.writeHead(414, {'Content-Type': 'text/html'});
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
});


//分页查询指定类别ID下所有文档
router.get('/contentList/listByParam', function(req, res, next) {
    var params = url.parse(req.url,true);
    var cateId = params.query.keywords;
    //    根据条件查询记录
    var reKey = new RegExp(cateId, 'i');
    var cateParam = {'sortPath' : { $regex: reKey } };
    DbOpt.pagination(Content,req, res,cateParam);

});

//查询所有文档按时间顺序显示

router.get('/contentList/newlistByCateId', function(req, res, next) {
    var contentList = DbOpt.getPaginationResult(Content,req, res,{'type':'content'});
    res.render('web/public/newItemList', {
        newListData : contentList.docs
    });
});


//查询指定类别ID下最热文档
router.get('/contentList/hotlistByCateId', function(req, res, next) {
    var params = url.parse(req.url,true);
    var cateId = params.query.cateId;
    //    模糊查询
    var reKey = new RegExp(cateId, 'i');
    var cateParam = {};
    cateParam = {'sortPath' : { $regex: reKey } , 'type' : 'content' };
    var contentList = DbOpt.getPaginationResult(Content,req, res,cateParam);
    res.render('web/public/hotNewsList', {
        listData : contentList.docs
    });
});

//查询首页下拉新增的文档列表
router.get('/contentList/getIndexContentList', function(req, res, next) {
    var contentList = DbOpt.getPaginationResult(Content,req, res,{'type' : 'content'});
    return res.json(contentList.docs)
});


//查询父类下全部子类
router.get('/contentCategorys/sonlist', function(req, res, next) {
//    模糊查询
    var params = url.parse(req.url,true);
    var cateId = params.query.cateId;
    var query={};
    if(cateId) {
        query['sortPath']=new RegExp(cateId);//模糊查询参数
    }
//    条件查询类别并排序
    var cateList = ContentCategory.find(query).sort({'sortId': 1});
    return res.json(cateList);

});



//查询文档标签
router.get('/tags/list', function(req, res, next) {
    res.render('web/public/tagsList', {
        tagsData : DbOpt.getContentsByID(ContentTags,req, res,{})
    });
});


//查找指定广告
router.get('/requestAds/ads/item', function(req, res, next) {
    DbOpt.findOne(Ads,req, res,"find one Adds")
});



module.exports = router;
