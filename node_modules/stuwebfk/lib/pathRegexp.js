module.exports = pathRegexp;
function pathRegexp (path){
    var paramNames = [];
    path = path.replace(/\?(.*)$/,"")
               .replace(/((\*{1}(?=\/))|(\*{1}(?=$)))/g,"(.*)")
               .replace(/((:(.*(?=\/)))|(:(.*(?=$))))/g,function(){
                    var len = arguments.length - 3;
                    for(var i=0;i<len;i++){
                        var avg = arguments[i+1];
                        if(typeof avg === "string" && avg[0] !== ":"){
                            paramNames.push(avg);
                        }
                    }
                    return "(.*)"
               })
               .replace(/\//g,"\\\/")
              
    var regexp = new RegExp("^"+path+"$");  // new change
    regexp.paramNames = paramNames;
    return regexp;
}
