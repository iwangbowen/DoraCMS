var url = require("url"),
    qs = require("querystring");
    
function query(req,res,next){

    var querystring = url.parse(req.url).query; // 请求参数部分

    // 判断是否有参数 new change.
    try{
        var queryObj = qs.parse(querystring);  // 转换为json格式
        req.query = queryObj || {};  // 赋值
    }catch(e){
        req.query = {}
    }
    
    next();
}

module.exports = query;