var fs = require("fs"),
    path = require("path");

// 过滤 \r\n
function filterRN(s){
    s = s.replace("\'","\"");
    s = s.replace(/\n/g,"\\n");
    s = s.replace(/\r/g,"\\r");
    return "result += \'"+s+"\';\n\r";
}    
    
module.exports = function(viewPath){
    
    var viewCache = {}
    fs.readdir(viewPath, function(err,files){
    
        files.forEach(function(fn){
            var filePath = path.join(viewPath,fn);
            fs.readFile(filePath,function(err,data){
            
                var str = data.toString();                
                var buf = [];
                buf.push('var result = "";')
                var bf = "";
                for(var i=0,len = str.length;i<len;){
                
                    if(str.slice(i,i+2) === "<%"){
                    
                        var end =  str.indexOf("%>",i);
                      
                        var js = str.slice(i+2,end);
                        
                        i = end+2;
                        buf.push(filterRN(bf));
                        bf = "";
                        
                        if(js.slice(0,1) === "="){
                            buf.push("\r\nresult += "+js.slice(1)+";\r\n")
                        }else{
                            buf.push("\r\n"+js+"\r\n");
                        }
                        
                    }else{
                        bf += str.slice(i,i+1);
                        i += 1;
                    }
                    
                }
                
                buf.push(filterRN(bf));
                buf.push("return result;")
                viewCache[fn] = new Function("locals",buf.join(""));
    
            });
        })
    })
    
    return function(req,res,next){
        res.view = function(fileName,locals){
            res.write(viewCache[fileName](locals || {})); //new change
            res.end();
        }
        next();
    }
    
}