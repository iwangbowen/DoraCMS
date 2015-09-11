/*
前后台公用js*/

$(function(){
    //用户注销
    $('#userLoginOut').click(function () {
        loginOut();
    });
});



function initPagination($scope,$http,localUrl,param){

//        定义翻页动作
    $scope.loadPage = function(page){
        $scope.currentPage = page;
        window.location.href = localUrl + "—"+$scope.currentPage+".html"+param;
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPage) {
            $scope.currentPage++;
            window.location.href = localUrl + "—"+$scope.currentPage+".html"+param;
        }
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            window.location.href = localUrl + "—"+$scope.currentPage+".html"+param;
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





function loginOut(){
    $.ajax({
        url: "/users/logout",
        method: "GET",
        success: function (result) {
            if (result === "success") {
                window.location = "/"
            } else {
                alert("未知异常，请稍后重试");
            }
        }
    })
}