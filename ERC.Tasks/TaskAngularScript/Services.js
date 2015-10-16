///reference path modules.js
app.service("ERCTask_Service", function ($http) {
    var url = "http://localhost:53588/api/";
    this.getAllTasks = function () {
        return $http.get(url + "GetAllTasks");
    };

    this.getAllUsers = function () {
        return $http.get(url + "GetAllUsers");
    };
    
    //create new task 
    this.AddTask = function (item) {
       
        var request = $http({
            method: "post",
            url: url + "AddTask",
            data:item
        }
            );
        return request;
    }

    this.AddSubTask = function (itemsub) {

        var request = $http({
            method: "post",
            url: url + "AddSubTask",
            data: itemsub
        }
            );
        return request;
    }
    //EDIT TASK BY ID 
    this.getTaskByID = function (id) {
        
        return $http.get(url + "GetTaskByID/" + id);
    };
   
    this.getSubTaskByID = function (id) {

        return $http.get(url + "GetSubTaskByID/" + id);
    };

    //delete task 
    this.DeleteTask = function (id) {
        
        var request = $http({
            method: "delete",
            url: url + "DeleteTasks/" + id
        }
            );
        return request;
    }
    this.DeleteSubTask = function (id) {

        var request = $http({
            method: "delete",
            url: url + "DeleteSubTasks/" + id
        }
            );
        return request;
    }
    //create new task 
    this.EditTask = function (item) {

        var request = $http({
            method: "put",
            url: url + "EditTask",
            data: JSON.stringify(item)
        }
            );
        return request;
    }

    this.EditSubTask = function (item) {

        var request = $http({
            method: "put",
            url: url + "EditSubTask",
            data: JSON.stringify(item)
        }
            );
        return request;
    }
    //Add Reccurrence of task
    this.AddReccurrence = function (item) {
       
        var request = $http({
            method: "post",
            url: url + "AddReccurence",
            data: JSON.stringify(item)
        }
            );
        return request;
    }


    //create new task 
    this.AddAssignment = function (Task) {

        var request = $http({
            method: "post",
            url: url + "AddAssignment",
            data: Task
        }
            );
        return request;
    }

    this.AddSubTaskAssignment = function (Task) {

        var request = $http({
            method: "post",
            url: url + "AddSubTaskAssignment",
            data: Task
        }
            );
        return request;
    }
    
});