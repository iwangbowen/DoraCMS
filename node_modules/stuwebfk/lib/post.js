module.exports = function post(req,res,next){

    var  body_data
        ,chunk_list = []
        ,contentType = req.headers["content-type"]
        ,contentLength = parseInt(req.headers["content-length"])
        // isMulti 如果是true，表示是设置了enctype="multipart/form-data" 属性
        ,isMulti = /(boundary=)/gi.test(contentType)
        ,boundary = RegExp["$'"]
        ,boundaryStandard = "--"+boundary+"\r\n"
        ,boundaryEnd = "--"+boundary+"--\r\n";
        
    req.body = {};
    req.files = {};
    
    req.on("data",function(chunk){
        chunk_list.push(chunk);
    })

    req.on("end",function(){

        body_data = Buffer.concat(chunk_list);
        
        if(isMulti){
        
            // 备用数据
            var backup = [];
            
            // 读取状态 
            // 0表示怀疑是边界字符串
            // 1表示正在读取头部信息字符串
            // 2表示正在读取body体数据
            var readState = 0;
            
            // body体数据
            var body = []
            
            // 正在读取的body_data的位置
            var position = 0;
            
            function handle(b){
                 switch(readState){
                    case 0:
                        // 确定是否是边界字符串
                        if(body_data.slice(position,position+boundaryStandard.length).toString() === boundaryStandard){
                            if(backup.length > 0){
                                body.push(backup);
                                backup = [];
                            }
                            else{
                                position += boundaryStandard.length;
                                readState = 1;
                            }
                        }else if(body_data.slice(position,position+boundaryEnd.length).toString() === boundaryEnd){
                        
                                if(backup.length > 0){
                                    body.push(backup);
                                }
                                return true;
                        }else{
                            backup.push(b);
                            position += 1;
                        }
                    break;
                    case 1:
                        if(backup.length>=3){
                            // backup得到后三位   
                            var arr3 = backup.slice(backup.length-3,backup.length);
                            arr3.push(b);
                            backup.push(b);
                            // 验证是否是 \r\n\r\n
                            if(new Buffer(arr3).toString() === "\r\n\r\n"){
                                body.push(backup);
                                backup = [];
                                readState = 2;
                            }
                        }else{
                            backup.push(b);
                        }
                        position +=1;
                    break;
                    case 2:
                        backup.push(b);
                        position += 1;
                    break;
                }
            }
            
            for(var len = body_data.length;position<len;){
            
                var b = body_data[position];
                
                // 判断是否为 "-"
                if(readState === 0 || readState === 2){
                    if(b === 45){ // 判断是否是 "-"
                        readState = 0;
                    }else{
                        readState = 2;
                    }
                }
                
                var end = handle(b);
                
                if(end){ // 解析结束，从body中解析出fieldName和对应的数据。
                
                    for(var i=0,len=body.length;i<len;){
                        
                        var header = new Buffer(body[i]).toString();
                        
                        // 数组转换二进制，为删除后面的 \r\n
                        var arr = body[i+1];
                        var data = new Buffer(arr.slice(0,arr.length-2)); 
                        
                        // 从头信息中解析出表单字段的名称，也就是表单的name属性值。
                        /name=\"(.*?)\"/g.test(header);
                        var fieldName = RegExp.$1;

                        // 判断是上传的文件，还是一般的表单字段。
                        var isFile = /filename/g.test(header);
                        if(isFile){
                            req.files[fieldName] = data;
                        }else{
                            req.body[fieldName] = data.toString();
                        }
                                                
                        i+=2; // 每次跳过两个，因为信息头和信息体为一对。
                    }
                
                    break;
                }
                
            }
        
        }else{
            try{
                var qs = require("querystring");
                req.body = qs.parse(body_data.toString()); // new change
            }catch(e){}
        }
        
        next();

    })
}
    
    