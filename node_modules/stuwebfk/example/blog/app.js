var fk = require("../..")
   ,App = fk.App
   ,download = fk.download
   ,app = new App
   // article DB
   ,articles = require("./articles")
   // type DB
   ,types = require("./types")
   ,admin = {loginname:"admin",password:"admin"}  // 登录帐号密码

   
   // 加载框架插件
   app.use(fk.static(__dirname+"/static"));
   app.use(fk.post);
   app.use(fk.query);
   app.use(fk.text);
   app.use(fk.download);
   app.use(fk.redirect);
   app.use(fk.session);
   app.use(fk.view(__dirname+"/view")); 
      
   // 判断是否已登录
   function isLogined(req){
       return req.session.logined;
   }
   
   app.get("/type/manage",function(req,res){
       if(isLogined(req)){
          res.view("type_manage.html",{types:types});
       }else{
          res.redirect("/");
       }       
   })
   
   app.get("/",function(req,res){
        var type = req.query.type,
            arts;
        if(type){
            arts = articles.findByType(type);
        }else{
            arts = articles;
        }
        res.view("index.html", {
                 isLogined:isLogined(req)
                ,title:"my blog"
                ,types:types
                ,articles:arts});
   })
   
   app.get("/login",function(req,res){
       res.view("login.html",{isLogined:isLogined(req)});
   })
   
   // 登录
   app.post("/login",function(req,res){
       if(req.body.loginname === admin.loginname 
       && req.body.password === admin.password){
            req.session.logined = true; 
            res.redirect("/");
       }else{
            res.view("login.html",{msg:"登录信息有误，请重新输入！"});
       }
   })
   
   // 退出
   app.get("/logout",function(req,res){
        req.session.logined = false;
        res.redirect("/");
   })
    
   // 打开创建文章的页面
   app.get("/create",function(req,res){
       if(isLogined(req)){
           res.view("create.html",{types:types})
       }else{
           res.redirect("/");
       }
   })
   
   // 显示文章内容
   app.get("/article/:id",function(req,res){
       var art = articles.get(req.params.id);
       if(art){
         res.view("view.html",{article:art});
       }else{
         res.text("no article!");
       }       
   })
   
   // 下载图片
   app.get("/img/:articleId",function(req,res){
       var art = articles.get(req.params.articleId);
       res.download("img",new Buffer(art.img,"base64"));
   })
   
   // 创建文章
   app.post("/create",function(req,res){
       if(isLogined(req)){
           req.body.img = req.files.img;
           articles.create(req.body);
       }
       res.redirect("/");
   })
   
   
   
   // 删除文章
   app.get("/del/:id",function(req,res){
      if(isLogined(req)){
         articles.del(req.params.id);
      }
      res.redirect("/");
   })
   
   // 打开更改页面
   app.get("/edit/:id",function(req,res){
       var art = articles.get(req.params.id);
       if(art && isLogined(req)){
            res.view("edit.html",{types:types,article:art});
       }else{
            res.redirect("/")
       } 
       
   })
   
   // 更改文章
   app.post("/update/:id",function(req,res){
      if(isLogined(req)){
         req.body.img = req.files.img;
         articles.update(req.body,req.params.id);
      }
      res.redirect("/");
   })
   
   // 创建类别
   app.post("/type/create",function(req,res){
      if(isLogined(req)){
         types.create(req.body.title);
      }
      res.redirect("/type/manage");
   })
   
   // 删除类别
   app.post("/type/del/:id",function(req,res){
      if(isLogined(req)){
         types.del(req.params.id);
      }
      res.redirect("/type/manage");  
   })
   
   // 更改类别名称
   app.post("/type/update/:id",function(req,res){
      if(isLogined(req)){
         types.update(req.body.title,req.params.id);
      }
      res.redirect("/type/manage");       
   })
   
   
   app.listen(3000);
   