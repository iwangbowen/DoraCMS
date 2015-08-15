
//字符串转换函数
//adminUser=true&adminGroup=true 转json对象
function changeDataTOJson(obj){
    var oldVal = obj.toString();
    var cg1 = oldVal.replace(/=/g, "':")
    var changeObj = "{'"+cg1 .replace(/&/g, ",'")+"}";
    return eval("(" + changeObj + ")");
}


//将后台获取的list解析为tree对象所需的json数据
function changeToTreeJson(result,key,oldValue){
    var arrTree = [];
    var treeItem;
    for(var i=0;i<result.length;i++){
        if(key === "tags" || key === "filmTypes"){
            var checkState = false;
            var tagsArr = oldValue.split(",");
            for(var j=0;j<tagsArr.length;j++){
                if(result[i].name === tagsArr[j].toString()){
                    checkState = true;
                    break;
                }
            }
            treeItem = new TagsTree(result[i]._id,result[i].name,checkState);

        }else if(key === "temps"){
            treeItem = new TempsTree(result[i]._id,result[i].name,result[i].alias);
        }else if(key === "tempForders"){
            treeItem = new TempsTree(0,result[i].name,"");
        }else{
//            alert(result[i].name+"--"+result[i].parentID)
            treeItem = new TreeInfo(result[i]._id,result[i].parentID,result[i].name,result[i].sortPath,result[i].homePage,result[i].contentTemp,true,false);
        }
        arrTree.push(treeItem);
    }
    return arrTree;
}

//获取指定类别ID对应的名称

function getCateNameById(result,id){

    for(var i=0;i<result.length;i++){

        if(result[i]._id === id){
            return result[i].name;
        }

    }
    return "请选择类别";
}

//    创建树对象结构
function TreeInfo(id,pId,name,sortPath,homePage,contentTemp,open,click){
    this.id = id;
    this.pId = pId;
    this.name = name;
    this.contentTemp = contentTemp;
    this.sortPath = sortPath;
    this.homePage = homePage;
    this.open = open;
    this.click = click;
}

// 创建标签树对象结构
function TagsTree(id,name,checked){
    this.id=id;
    this.name=name;
    this.checked=checked;
}

//创建模板树对象结构
function TempsTree(id,name,alias){
    this.id=id;
    this.name=name;
    this.alias=alias;
}

//翻页组件

function getPageInfos($scope,$http,url){

//        定义翻页动作
    $scope.loadPage = function(page){
        $scope.currentPage = page;
        getPageInfos($scope,$http,url)
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPage) {
            $scope.currentPage++;
            getPageInfos($scope,$http,url);
        }
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getPageInfos($scope,$http,url);
        }
    };

    $http.get(url+"?limit="+$scope.limit+"&currentPage="+$scope.currentPage+"&keywords="+$scope.keywords).success(function(result){
        console.log("getData success!");

        $scope.data = result.docs;
        if(result.pageInfo){
            $scope.totalItems = result.pageInfo.totalItems;
            $scope.currentPage = result.pageInfo.currentPage;
            $scope.limit = result.pageInfo.limit;
            $scope.startNum = result.pageInfo.startNum;
            //获取总页数
            $scope.totalPage = Math.ceil($scope.totalItems / $scope.limit);
            //生成数字链接
            var pageNum =  Number($scope.currentPage);
            if ($scope.currentPage > 1 && $scope.currentPage < $scope.totalPage) {
                $scope.pages = [
                        $scope.currentPage - 1,
                    $scope.currentPage,
                        $scope.currentPage + 1
                ];
            }
            else if ($scope.currentPage == 1 && $scope.totalPage == 1) {
                $scope.pages = [
                    $scope.currentPage

                ];
            }
            else if ($scope.currentPage == 1 && $scope.totalPage > 1) {
                $scope.pages = [
                    $scope.currentPage,
                        $scope.currentPage + 1
                ];
            } else if ($scope.currentPage == $scope.totalPage && $scope.totalPage > 1) {
                $scope.pages = [
                        $scope.currentPage - 1,
                    $scope.currentPage
                ];
            }
        }else{
            console.log("获取分页信息失败")
        }

    })
}

//新增广告中的图片信息模型

function getImgInfo(imgUrl,link,width,height,target,details){
    var html = "";
    var listId = "imgInfo_"+Math.round(Math.random()*100);
    var scale = width + "*" + height;
    html += "<div class='alert alert-info fade in' id='"+listId+"'>";
    html += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
    html += "<div class='col-sm-3'>";
    html += "<img src='"+imgUrl+"' alt='' class='img-thumbnail'/><br/><br/>";
//    html += "<button class='btn btn-primary btn-xs hide'><span class='fa fa-fw fa-edit' aria-hidden='true'></span></button>";
    html += "<a href='#' role='button' class='btn btn-primary hide' data-whatever='"+imgUrl+"' data-toggle='modal' data-target='#addNewAdImg'><span class='fa fa-fw fa-edit' aria-hidden='true'></span></a>"
    html += "</div>";
    html += "<div class='col-sm-8'><div class='form-group'>";
    html += "<label class='col-sm-4 control-label'>图片链接</label>";
    html += "<div class='col-sm-8'><p class='form-control-static'>"+link+"("+target+")"+"</p></div>";
    html += "<label class='col-sm-4 control-label'>图片宽高</label>";
    html += "<div class='col-sm-8'><p class='form-control-static'>"+scale+"</p></div>";
    html += "<label class='col-sm-4 control-label'>图片详情</label>";
    html += "<div class='col-sm-8'><p class='form-control-static'>"+details+"</p></div>";
    html += "</div></div>";
    html += "<div class='clearfix'></div>";
    html += "</div>";

    return html;
}


//初始化七牛云存储
function initQiniuBtn($scope,containerId,bottonId,callBack){
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'pickfiles',       //上传选择的点选按钮，**必需**
        uptoken_url: '/users/qiniu/upToken',
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://7xkrk4.com1.z0.glb.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'upContainer',           //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb',           //最大文件体积限制
        flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
            mime_types : [
                {title : "Image files", extensions: "jpg,jpeg,gif,png"}
            ]
        },
        multi_selection : false,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                var res = jQuery.parseJSON(info);

                callBack($scope,domain,res);

            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "";
                // do something with key here
                return key
            }
        }
    });
// domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
// uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
}

//七牛缩略图参数设置
function thumbnailStr(size){
    var imgLink = Qiniu.imageMogr2({
        strip: true,   // 布尔值，是否去除图片中的元信息
        thumbnail: size,  // 缩放操作参数
        quality: 100,  // 图片质量，取值范围1-100
        format: 'png'// 新图的输出格式，取值范围：jpg，gif，png，webp等
    });

    return '?'+imgLink;
}

//用户上传文章主图的回调函数
function afterUpdateContentImg($scope,domain,res){


    var sourceLink = domain + res.key; //获取上传成功后的文件的Url

    alert('上传成功');

    $scope.formData.sImg = '/'+res.key;


    $("#myImg").attr("src",sourceLink+thumbnailStr('100x100'));

}


//用户上传插件的回调函数

function afterUpdatePlugImg($scope,domain,res){


    var sourceLink = domain + res.key; //获取上传成功后的文件的Url

    alert('上传成功');

    $scope.formData.sImg = '/'+res.key;

    $("#myImg").attr("src",sourceLink+thumbnailStr('112x140'));

}