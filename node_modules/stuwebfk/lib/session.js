
var sid = Date.now() , cache = {}
   
module.exports = function(req,res,next){

    Object.defineProperty(req,"session",{
        get: function(){
            return cache[this.sessionId] || (cache[this.sessionId] = {});  // new change.
        },
        set: function(value){
            cache[this.sessionId] = value;
        }
    })

    if(!(req.headers.cookie && (req.sessionId = parse(req.headers.cookie).sessionId))){
    
        req.sessionId = sid += 1;
        res.setHeader("Set-Cookie",["sessionId="+req.sessionId])
    }
    
    next();
    
}

// 把cookie字符串转换为json对象
function parse(str){
    var arr = str.split(";")
       ,obj = {}
       
    arr.forEach(function(field){
        var o = field.split("=");
        obj[o[0].trim()] = o[1];
    })
    
    return obj;
}
