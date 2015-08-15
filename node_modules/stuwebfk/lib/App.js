var http = require("http")
   ,pathRegexp = require("./pathRegexp")
   ,url = require("url");

module.exports = App;

function App(){
    // 插件有序列表
    var middleList = this._middleList = [];
    
    var self = this;

    this._route_post_handles = [] //最新修改

    this._route_get_handles = [] //最新修改
    
    // request事件响应函数
    function handle(req,res){
            
        req.params = {};
        
        // 循环执行插件
        var middleIndex = 0; // 插件索引
        
        execMiddle();
        
        // 执行这个函数时，会自动执行下一个middle插件。
        // 至于这个函数的执行，是由插件所控制。
        function next(){
            middleIndex += 1;
            execMiddle();
        }
        
        // 执行插件函数
        function execMiddle(){
            var middle = middleList[middleIndex];
            if(middle){
                middle(req,res,next);
            }else{
               var handle;
               
               // 把 /abc?age=12 转为 /abc
               var path = url.parse(req.url).pathname;  //最新修改
               
               // 找到路由对应的路由处理器。
               function findHandle(route_handles){ //最新修改
                    for(var i=0,len=route_handles.length; i<len ; i++){
                        var route_handle = route_handles[i];
                        var pass = route_handle.route.test(path);
                        if(pass){
                            route_handle.route.paramNames.forEach(function(name,index){
                                req.params[name] = RegExp["$"+(index+1)];
                            })
                            handle = route_handle.handle;
                            break;
                        }
                    }    
               }
               
               // 判断是GET还是POST方法
               switch(req.method){
                     case "GET":
                         // handle = self._route_get_handles[req.url]
                         findHandle(self._route_get_handles); //最新修改
                     break;
                     case "POST":
                         // handle = self._route_post_handles[req.url]
                         findHandle(self._route_post_handles); //最新修改
                     break;
               }
               
               if(handle){
                   handle(req,res);
               }else{
                   // 没找到指定处理器，返回404
                   res.statusCode = 404; //最新修改
                   res.end(); //最新修改
               }
            }
        }        
        
    }
    
    this._server = http.createServer(handle);
    
}

// 加入功能栈
App.prototype.use = function(middle){
    this._middleList.push(middle);
}

App.prototype.get = function(route,handle){ //最新修改
    this._route_get_handles.push({route:pathRegexp(route),handle:handle})
}

App.prototype.post = function(route,handle){ //最新修改
    this._route_post_handles.push({route:pathRegexp(route),handle:handle})
}

// 监听端口
App.prototype.listen = function(){
    this._server.listen.apply(this._server,arguments);
}