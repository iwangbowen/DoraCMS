module.exports = function(req,res,next){
    res.redirect = function(url){
        res.writeHead(302,{
            Location: location(req,url)
        })
        res.end();
    }
    next();    
}

// 返回要跳转的URL绝对地址
function location(req,url){
    // 如果是完整的网址
    if(/^http:\/\//.test(url)){
        return url;
    }else if(/^\//.test(url)){ // 如果是本地根目录网址
        return 'http://' + req.headers.host + url;
    }else{
        return 'http://' + req.headers.host + '/' + req.url + '/' + url;
    }  
}

