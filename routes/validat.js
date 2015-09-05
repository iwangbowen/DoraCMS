/**
 * Created by Administrator on 2015/4/29.
 * 对权限进行控制
 */
var express = require('express');
var router = express.Router();
//管理员用户组对象
var AdminGroup = require("../models/AdminGroup");

function isAdminLogined(req){
    return req.session.adminlogined;
}


router.get("/manage",function(req,res,next){
    if(isAdminLogined(req)){
        next();
    }else{
        res.redirect("/admin");
    }
});

router.get("/manage/:defaultUrl",function(req,res,next){

    if(isAdminLogined(req)){
        next();
    }else{
        res.redirect("/admin");
    }

});


module.exports = router;