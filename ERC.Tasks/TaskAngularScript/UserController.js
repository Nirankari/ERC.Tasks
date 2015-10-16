/// <reference path="../Scripts/angular.min.js" />  
/// <reference path="Modules.js" />  
/// <reference path="Services.js" />  

app.controller("UserController", function ($scope, UserService) {
    $scope.error = "";
    $(document).keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $scope.ValidateUser();
        }
    });

    $scope.ValidateUser = function () {
      
        var item = { "UserName": $scope.username, "DisplayName": $scope.password };
        var promiseget = UserService.ValidateUser(item);
        promiseget.then(function (pl) {
            var res = pl.data;
            
            if (res == "ok")   {               
                $scope.error = "";             
                window.location.href = "../home/";
            }
            else {
                
                $scope.error = "Please enter again!";
            }
        }, function (err) {
            localStorage.setItem("login", "");
            $scope.error = "";
        });
    }    

});
