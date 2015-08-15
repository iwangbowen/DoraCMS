/**
 * Created by Administrator on 2015/4/18.
 */

var url = require('url');
//加密类
var crypto = require("crypto");
var mongoose = require('mongoose');
//站点配置
var Settings = require("../models/db/settings");
var db = mongoose.connect('mongodb://localhost/doracms');
//mongoose.connect('mongodb://'+Settings.USERNAME+':'+Settings.PASSWORD+'@'+Settings.HOST+':'+Settings.PORT+'/'+Settings.DB+'');

//信息删除操作

var DbOpt = {


    del : function(obj,req,res,logMsg){
        var params = url.parse(req.url,true);
        obj.remove({_id : params.query.uid},function(err,result){
            if(err){
                res.end(err);
            }else{
                console.log(logMsg+" success!")
                res.end("success");
            }
        })
    },
    findAll : function(obj,req,res,logMsg){//查找指定对象所有记录
        obj.find({}, function (err,result) {
            if(err){

            }else{
                console.log(logMsg+" success!")
                return res.json(result);
            }
        })
    },
    findOne : function(obj,req,res,logMsg,key){ //根据ID查找单条记录
        var params = url.parse(req.url,true);
        var currentId = (params.query.uid).split('.')[0];
        obj.findOne({_id : currentId}, function (err,result) {
            if(err){

            }else{
                console.log(logMsg+" success!")
//                针对有密码的记录，需要解密后再返回
//                if(key && result.password){
//                    var decipher = crypto.createDecipher("bf","dora");
//                    var oldPsd = "";
//                    oldPsd += decipher.update(result.password,"hex","utf8");
//                    oldPsd += decipher.final("utf8");
//                    result.password = oldPsd;
//                }
                return res.json(result);
            }
        })
    },
    updateOneByID : function(obj,req,res,logMsg){
        var params = url.parse(req.url,true);
        var conditions = {_id : params.query.uid};
        req.body.updateDate = new Date();
        var update = {$set : req.body};
        obj.update(conditions, update, function (err,result) {
            if(err){

            }else{
                console.log(logMsg+" success!");
                res.end("success");
            }
        })
    },
    addOne : function(obj,req,res,logMsg){
        var newObj = new obj(req.body);
        newObj.save();
        console.log(logMsg+" success!");
        res.end("success");
    },
    findListByParams : function(obj,req,res,params){
        obj.find(params, function (err,result) {
            if(err){

            }else{
                return res.json(result);
            }
        })
    },
    pagination : function(obj,req,res,conditions){

        var params = url.parse(req.url,true);
        var startNum = (params.query.currentPage - 1)*params.query.limit + 1;
        var currentPage = Number(params.query.currentPage);
        var limit = Number(params.query.limit);
        var pageInfo;

//    根据条件查询记录(如果有条件传递，则按条件查询)
        var query;
        if(conditions && conditions.length > 1){
            query=obj.find().or(conditions);
        }
        else if(conditions){
            query=obj.find(conditions);
        }
        else{
            query=obj.find({});
        }

        query.sort({'date': -1});
        query.exec(function(err,docs){
            if(err){
                console.log(err)

            }else {
                pageInfo = {
                    "totalItems" : docs.length,
                    "currentPage" : currentPage,
                    "limit" : limit,
                    "startNum" : Number(startNum)
                };

                return res.json({
                    docs : docs.slice(startNum - 1,startNum + limit -1),
                    pageInfo : pageInfo
                });
            }
        })
    },
    findAllSonListByCateId : function (obj,req,res,cateId) {
//    在nodejs中，必须要使用RegExp，来构建正则表达式对象,参数必须为cateId
        var query={};
        if(cateId) {
            query['sortPath']=new RegExp(cateId);//模糊查询参数
        }
        obj.find(query,function(err,result){
            if(err){
                console.log(err)
            }else{
                return res.json(result);
            }
        })
    },
    getPaginationResult : function(obj,req,res,q){// 通用查询，带分页，注意参数传递格式
        var searchKey = req.query.searchKey;
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.limit);
        if (!page) page = 1;
        if (!limit) limit = 24;
        var order = req.query.order;
        var sq = {}, Str, A = 'problemID', B = 'asc';
        if (order) {    //是否有排序请求
            Str = order.split('_');
            A = Str[0]; B = Str[1];
            sq[A] = B;    //关联数组增加查询条件，更加灵活，因为A是变量
        } else {
            sq.date = -1;    //默认排序查询条件
        }

        var startNum = (page - 1)*limit;
        var resultList = obj.find(q).sort(sq).skip(startNum).limit(limit);
        //        分页参数
        var pageInfo = {
            "totalItems" : obj.find(q).count(),
            "currentPage" : page,
            "limit" : limit,
            "startNum" : startNum +1,
            "sort" : req.query.sort,
            "time" : req.query.time,
            "searchKey" : searchKey
        };
        var datasInfo = {
            docs : resultList,
            pageInfo : pageInfo
        }

        return datasInfo;
    },
    getContentsByID : function(obj,req,res,q){// 通用查询list不带分页，注意参数传递格式,通过express-promise去掉了回调方式返回数据

        return obj.find(q).sort({'date': -1}).find();

    },
    getObjCount : function(obj,conditions){ // 查询指定对象的数量
        obj.count(conditions, function (err, count) {
            if (err){
                console.log(err);
            }else{
                return count;
            }

        });
    },
    getCount : function(obj,req,res,conditions){ // 查询指定对象的数量
        obj.count(conditions, function (err, count) {
            if (err){
                console.log(err);
            }else{
                return res.json({
                    count : count
                });
            }

        });
    },
    encrypt : function(data,key){ // 密码加密
        var cipher = crypto.createCipher("bf",key);
        var newPsd = "";
        newPsd += cipher.update(data,"utf8","hex");
        newPsd += cipher.final("hex");
        return newPsd;
    },
    decrypt : function(data,key){ //密码解密
        var decipher = crypto.createDecipher("bf",key);
        var oldPsd = "";
        oldPsd += decipher.update(data,"hex","utf8");
        oldPsd += decipher.final("utf8");
        return oldPsd;
    }
};



module.exports = DbOpt;