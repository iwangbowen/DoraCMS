
$(function(){
    $('.soitem').hover(function(){
        $(this).find('.soitemcontent:eq(0)').show();
    },function(){
        $(this).find('.soitemcontent:eq(0)').hide();
    });


//    下拉菜单
    $('.sotj > .soitemcontent').find('li').hover(function(){
        $(this).find('.soitemcontent:eq(0)').css({
            'left' : '126px',
            'top' : '0px'
        }).show();
    },function(){
        $(this).find('.soitemcontent:eq(0)').hide();
    });

//    搜索按钮
    $('#soform > form').find('.fa-search').click(function(){
        $('#soform').addClass('open');
    });

    $('#soform').hover(function(){},function(){
        $('#soform').removeClass('open');
    });
//    关闭登录窗口
    $('#closeLoginModal').click(function(){
        $('#uLoginModal').modal('hide')
    });

//    二维码显示
    $('#cweixin').hover(function(){
        $(this).find('div:eq(0)').addClass('showQr');
    },function(){
        $(this).find('div:eq(0)').removeClass('showQr');
    });

//    返回顶部
    $('#gotop').click(function(){
        $('body,html').animate({scrollTop:0},800);
        return false;
    });

//    监听滚动条位置
    $(window).scroll(function(event) {
        if(getScrollTop() > 60){
            $('#cbbfixed').css('bottom' , '10px');
        }else{
            $('#cbbfixed').css('bottom' , '-85px');
        }
    });

});

//兼容方式获取scrolltop以及设置scrolltop
function getScrollTop() {
    var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    return scrollTop;
}

function setScrollTop(scroll_top) {
    document.documentElement.scrollTop = scroll_top;
    window.pageYOffset = scroll_top;
    document.body.scrollTop = scroll_top;
}

//    点击用户头像
$('#showMyOpt').click(function(){
    $('#uoptlist').hover(function(){},function(){
        $('#uoptlist').removeClass('show').addClass('hide');
    }).toggleClass('show');
})


//广告初始化
function initAds(id,targetId) {

    $.ajax({
        url:"/content/requestAds/ads/item?uid="+id,
        type:"get",
        dataType:"json",
        success:function(data){
            if(!data){
                return;
            }
            if(data.type === "1"){
                var imgContent = data.content;
                var imgList = imgContent.replace(/},/g,"};").split(";");
                var imgItems = "";
                for(var i=0;i<imgList.length;i++){
                    var item = JSON.parse(imgList[i]);
                    if(i==0){
                        imgItems += "<div class='active item'><a href='"+item.link+"' target='"+item.target+"'><img width='"+item.width+"' height='"+item.height+"' src='"+item.sImg+"' alt='"+item.discription+"'></a></div>";
                    }
                    else{
                        imgItems += "<div class='item'><a href='"+item.link+"' target='"+item.target+"'><img width='"+item.width+"' height='"+item.height+"' src='"+item.sImg+"' alt='"+item.discription+"'></a></div>";
                    }
                }
                adsTemp(imgItems,targetId,imgList.length);
            }else{
                var contentObj = JSON.parse(data.content);
                var txtHtml = "";
                txtHtml += "<a href='"+contentObj.link+"' target='_blank'><i class='fa fa-tags'></i>"+contentObj.title+"</a>";
                $("#"+targetId).html(txtHtml);
            }

        }
    });
}

//添加轮播广告
function adsTemp(imgItems,targetId,imgLength){
    var adsId = "imgInfo_"+Math.round(Math.random()*100);
    var html="";
    html += "<div class='front-carousel'><div id='"+adsId+"' class='carousel slide'><div class='carousel-inner'>"
    html += imgItems;
    html += "</div>";
    if(imgLength > 1){
        html += "<a class='carousel-control left' href='#"+adsId+"' data-slide='prev'><i class='fa fa-angle-left'></i></a>"
        html += "<a class='carousel-control right' href='#"+adsId+"' data-slide='next'><i class='fa fa-angle-right'></i></a>"
    }
    html += "</div></div>"
    $("#"+targetId).html(html);

}



//new翻页
function initPagination($scope,$http,localUrl,sortParam){

//        定义翻页动作
    $scope.loadPage = function(page){
        $scope.currentPage = page;
        window.location.href = localUrl + "—"+$scope.currentPage+".html"+sortParam;
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPage) {
            $scope.currentPage++;
            window.location.href = localUrl + "—"+$scope.currentPage+".html"+sortParam;
        }
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            window.location.href = localUrl + "—"+$scope.currentPage+".html"+sortParam;
        }
    };


    if($scope.currentPage){
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

}




//用户注销
$('#userLoginOut').click(function () {
    loginOut();
});

$('#cm-s1').click(function () {
    loginOut();
});


function loginOut(){
    $.ajax({
        url: "/users/logout",
        method: "GET",
        success: function (result) {
            if (result === "success") {
//                  登出qq
                QC.Login.signOut();
                window.location = "/"
            } else {
                alert("未知异常，请稍后重试");
            }
        }
    })
}



//导航菜单高亮
function highLightNav(parentId) {
    var navList = $("#mainNav").find("li");
    for(var i=1;i<navList.length;i++){
        var listObj = $(navList[i]);
        var oldId = listObj.attr("id");
        var nId = oldId.split("_")[1];
        if(nId == parentId){
            listObj.addClass("active").siblings().removeClass("active");
        }
    }
}

//更新访问量
function updateClickNum(contentId,oldNum) {
    $.ajax({
        url : "/content/clickNum/update?uid="+contentId+"&clickNum="+oldNum,
        method : "GET",
        success : function(){
            $("#clNum").text(Number(oldNum) + 1);
        }
    })
}

//更新喜欢文章
function updateMylike(contentId,likeUserIds){

    var hasLike;
    var likeObj = $('.ilike').find('a').eq(0);
    if(likeObj.hasClass('hasLike')){ // 已经喜欢
        hasLike = 1;
    }else{// 还没喜欢
        hasLike = 0;
    }
    var uid = $('#uid').val();

    if(uid){
       $.ajax({
            url : "/content/ilike/update?contentId="+contentId+"&uid="+uid,
            method : "GET",
            success : function(result){

                if(hasLike == 1){
                    likeObj.removeClass('hasLike');
                }else{
                    likeObj.addClass('hasLike');
                }
                $(".likecount").text(result);

            }
        })
    }else{
        $('#uLoginModal').modal('show');
    }
}

//初始化喜欢数量信息
function initLikeNum(likeUserIds){
    var uid = $('#uid').val();
    var userArray = [];
    if(likeUserIds){
        userArray = likeUserIds.split(',');
        if(uid){
            if(userArray.length > 0){
                for(var i=0;i<userArray.length;i++){
                    if(userArray[i] == uid){
                        $('.ilike').find('a').eq(0).addClass('hasLike');
                    }
                }
            }
        }
    }
    $(".likecount").text(userArray.length);
}


//更新点赞的留言
function updateMyPraise(msgId){

    var hasPraise;
    var praiseObj = $('#msg_'+msgId).find('.cpraise');
    if(praiseObj.hasClass('hasPraise')){ // 已赞
        return;
    }else{// 还没赞
        var uid = $('#uid').val();
        if(uid){
            $.ajax({
                url : "/content/iPraise/update?msgId="+msgId+"&uid="+uid,
                method : "GET",
                success : function(result){
                    praiseObj.addClass('hasPraise');
                    $('#msg_'+msgId).find('span.num').text(result);
                }
            })
        }else{
            $('#uLoginModal').modal('show');
        }
    }

}


//初始化用户上传头像按钮
function initUploadLogoBtn($scope){
    $("#uploadify").uploadify({
        //指定swf文件
        'swf': '/plugins/uploadify/uploadify.swf',
        //后台处理的页面
        'uploader': '/system/upload?type=images&key=userlogo',
        //按钮显示的文字
        'buttonText': '选择图片',
        //显示的高度和宽度，默认 height 30；width 120
        'height': 40,
        'width': 138,
        //上传文件的类型  默认为所有文件    'All Files'  ;  '*.*'
        //在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeDesc': 'Image Files',
        //允许上传的文件后缀
        'fileTypeExts': '*.gif; *.jpg; *.png',
        //发送给后台的其他参数通过formData指定
//                    'formData': { 'type': 'images', 'key': 'ctTopImg' },
        //上传文件页面中，你想要用来作为文件队列的元素的id, 默认为false  自动生成,  不带#
        //'queueID': 'fileQueue',
        //选择文件后自动上传
        'auto': true,
        //设置为true将允许多文件上传
        'multi': true,
        //上传成功
        'onUploadSuccess' : function(file, data, response) {
                alert("上传成功");

//            $('#logoPath').val(data);
            $scope.logoFormData.logo = data;
            $("#myImg").attr("src",data);
            $('#submitLogo').removeClass('disabled');
        },
        'onComplete': function(event, queueID, fileObj, response, data) {//当单个文件上传完成后触发
            //event:事件对象(the event object)
            //ID:该文件在文件队列中的唯一表示
            //fileObj:选中文件的对象，他包含的属性列表
            //response:服务器端返回的Response文本，我这里返回的是处理过的文件名称
            //data：文件队列详细信息和文件上传的一般数据

            alert("文件:" + fileObj.name + " 上传成功！");
        },
        //上传错误
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
        'onError': function(event, queueID, fileObj) {//当单个文件上传出错时触发
            alert("文件:" + fileObj.name + " 上传失败！");
        }
    });
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

//用户上传logo的回调函数
function afterUpdateLogo($scope,domain,res){


    var sourceLink = domain + res.key; //获取上传成功后的文件的Url

    alert('上传成功');

    $scope.logoFormData.logo = sourceLink;

    $('#submitLogo').removeClass('disabled');

    $("#myImg").attr("src",sourceLink+thumbnailStr('100x100'));

}


//bootStrap模态窗口居中
function centerModals(){
    $('.modal').each(function(i){
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}







