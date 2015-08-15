var articles = []
   ,fs = require("fs");

// 读取数据文件加载到articles
try{
    var data = fs.readFileSync("articles.db");
    articles = JSON.parse(data.toString()).articles;
}catch(e){}   
   
// 扩展 articles 对象，具有CURD功能。
// 创建article
articles.create = function(data){
   var art = {
      createTime:Date.now(),
      updateTime:Date.now(),
      id:"ID-"+Date.now(),
      typeId:data.type,
      img:data.img?data.img.toString("base64") : "",
      title:data.title,
      content:data.content
   }
   articles.unshift(art);
}

// 删除文章
articles.del = function(id){
   var index = this.getIndex(id);
   if(index !== null){
       this.splice(index,1);
   }
}

// 通过ID得到文章所在索引
articles.getIndex = function(id){
   var self = this,
       index = null;
       
   this.forEach(function(art,idex){
       if(art.id === id){
           index = idex;
       }
   })
   
   return index;
}

// 通过type id查找article
articles.findByType = function(type){

  var self  = this,
      rs = [];
      
  this.forEach(function(art){
      if(art.typeId === type){
        rs.push(art);
      }
  })
  
  return rs;
  
}

// 是否有指定type的articles
articles.has = function(type){
   var bool = false;
   try{
       this.forEach(function(art){
          if(art.typeId === type){
            bool = true;
            throw new Error();
          }
       })
   }catch(e){}
   return bool;
}

// 通过ID得到文章
articles.get = function(id){
    var index = this.getIndex(id);
    if(index === null){
        return null;
    }else{
        return this[index];
    }
}

// 修改文章
articles.update = function(data,id){
  var index = this.getIndex(id);
  if(index !== null){
     var art = this[index];
     art.title = data.title;
     art.img = data.img ? data.img.toString("base64") : "";
     art.content = data.content;
     art.typeId = data.type;
     art.updateTime = Date.now();  
  }
}

// 每10秒保存一次
function save(){
    fs.writeFile('articles.db',JSON.stringify({articles:articles}))
}

setInterval(save,10*1000);

module.exports = articles;

