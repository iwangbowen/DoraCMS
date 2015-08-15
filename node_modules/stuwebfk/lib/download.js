module.exports = function(req,res,next){
    
    res.download = function(fileName,buf){
    
        // 判断buf是否是Buffer对象
        if(Buffer.isBuffer(buf)){
            res.writeHead(200, {
                // 设置下载文件名称
                'Content-disposition': 'attachment; filename=' + fileName,
                // 保证是二进制类型，这样浏览器可用下载方式
                'Content-Type': 'application/octet-stream',
                // 设置buf大小
                'Content-Length': buf.length
            });
            res.write(buf);
            res.end();
        }else{
            res.end();
        }
        
    }
    
    next();
    
}