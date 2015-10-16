app.service("UserService", function ($http) {
    var url = "http://localhost:53588/Home/";
    //create new task 
    this.ValidateUser = function (item) {
       
        var request = $http({
            method: "post",
            url: url + "Validate/",
            data: item
        }
            );
        return request;
    }
});