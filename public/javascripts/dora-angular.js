
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

//初始化分页
function initPagination($scope,$http,currentPage,searchKey){
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.totalItems = 1;
    $scope.limit = 10;
    $scope.pages = [];
    $scope.startNum = 1;
    $scope.keywords = searchKey;
    getPageInfos($scope,$http,"/admin/manage/getDocumentList/"+currentPage);
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

    $http.get(url+"?limit="+$scope.limit+"&currentPage="+$scope.currentPage+"&searchKey="+$scope.keywords).success(function(result){
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