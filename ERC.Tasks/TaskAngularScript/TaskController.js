/// <reference path="../Scripts/angular.min.js" />  
/// <reference path="Modules.js" />  
/// <reference path="Services.js" />  


app.controller("ERCTask_Controller", function ($scope,$filter, ERCTask_Service)  {
    

    alert(daysInMonth(7, 2009)); //31

    $scope.CurrentMonthAdd =new Date().getDate((new Date).setDate()+1);
    alert($scope.CurrentMonthAdd); //31
    //Month is 1 based
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    //July
   


    var gid = 0;
    var gcat = 1;
    
    $scope.appStartTime = 1;
    $scope.appEndTime = 4;
    $scope.appDurationTime =  parseFloat( ($scope.appEndTime - $scope.appStartTime) /2) + " hrs";
    $scope.YearlymonthLast = "January";
    $scope.YearlyWeek = "Monday";
    $scope.MonthWeekNo = "First";
    $scope.Yearlymonth = "January";
    $scope.YearWeekNo = "First";
    $scope.YearInterval = "";

    $scope.subduedate5 = new Date();
    $scope.subduedate6 = new Date();
    $scope.YearWeekNo = "";
       //1 Mean New Entry  
    $scope.loader = {
        loading: false,
    };
    GetAllTaskRecords();
    GetAllUsers();
    //To Get All Records  
    function GetAllTaskRecords() {
       
        $scope.loader.loading = true;
        var promiseget = ERCTask_Service.getAllTasks();
         promiseget.then(function (pl) {
            
             $scope.Tasks = pl.data;
             
            
            $scope.loader.loading = false;
           },
                function (errorpl) {
                   
                });    
    }



   

    //--------------------------- --------------------------------------------------

    $scope.reverse = false;
    $scope.resetAll = function () {

        $scope.filteredList = $scope.Tasks;
        $scope.Header = ['', '', '', '', '', '', ''];

    }

    $scope.sort = function (sortBy) {
       
        
       

        
        
       
        
        $scope.resetAll();
        $scope.columnToOrder = sortBy;
        $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);
        if ($scope.reverse) iconName = 'glyphicon glyphicon-chevron-up ';
        else iconName = 'glyphicon glyphicon-chevron-down';

        if (sortBy == "Title") {
            $(sp1).hide();
            
            $(sp2).show();
            $(sp3).show();
            $(sp4).show();
            $(sp5).show();
            $(sp6).show();
            $(sp7).show();
            $scope.Header[0] = iconName;
           
        } else if (sortBy == 'Description') {
            $(sp2).hide();
            $(sp1).show();
            
            $(sp3).show();
            $(sp4).show();
            $(sp5).show();
            $(sp6).show();
            $(sp7).show();
            $scope.Header[1] = iconName;

            

        } else if (sortBy == 'StartDate') {
            $(sp3).hide();
            $(sp1).show();
            $(sp2).show();
           
            $(sp4).show();
            $(sp5).show();
            $(sp6).show();
            $(sp7).show();

            $scope.Header[2] = iconName;

        }
        else if (sortBy == 'TaskDueDate') {
            $(sp4).hide();
            $(sp1).show();
            $(sp2).show();
            $(sp3).show();
            
            $(sp5).show();
            $(sp6).show();
            $(sp7).show();

            $scope.Header[3] = iconName;

        } else if (sortBy == 'CreatedDate') {
            $(sp5).hide();
            $(sp1).show();
            $(sp2).show();
            $(sp3).show();
            $(sp4).show();
           
            $(sp6).show();
            $(sp7).show();

            $scope.Header[4] = iconName;

        } else if (sortBy == 'TaskAssignedTo') {
            $(sp6).hide();
            $(sp1).show();
            $(sp2).show();
            $(sp3).show();
            $(sp4).show();
            $(sp5).show();
            
            $(sp7).show();

            $scope.Header[5] = iconName;

        } else if (sortBy == 'TaskAssignedBy') {
            $(sp7).hide();
            $(sp1).show();
            $(sp2).show();
            $(sp3).show();
            $(sp4).show();
            $(sp5).show();
            $(sp6).show();
            
            $scope.Header[6] = iconName;

        }

        $scope.reverse = !$scope.reverse;
 };

   

    //--------------------------------------------------------------------------------------------------------------




    function GetAllUsers() {
       
        var promiseget = ERCTask_Service.getAllUsers();
        promiseget.then(function (pl) {
            $scope.ActiveUsers = pl.data;
           
        },
               function (errorpl) {
                   
               });    
    }
    $scope.FilterCriteria = function (record) {
       
        //var startofweek = moment().startOf("week");
        //var endofweek = moment().endOf("week");
        //var recordDate = new Date(record.TaskDueDate);

       
       var istitleSearch = ($scope.Title == "" || $scope.Title == undefined) ? true : (record.Title.indexOf($scope.Title) > -1);
       
       return true;// recordDate >= startofweek && recordDate <= endofweek && istitleSearch;

      

       return istitleSearch;
    }
    $scope.Tstatus = [{ "Name": "Open" }, { "Name": "Closed" }, { "Name": "In Progress" }, { "Name": "Not Started" }, { "Name": "Deferred" }, { "Name": "Waiting on someone else" }];
    $scope.removeItem = function (index) {
       
        if (gcat == 0) {
            var promiseDelete = ERCTask_Service.DeleteTask($scope.TaskID);
            promiseDelete.then(function (pl) {
                $scope.Message = "Task Deleted Successfuly";
                GetAllTaskRecords();

            }, function (err) {
               // console.log("Some Error Occured." + err);
            });

        }
        else {
            var promiseDelete = ERCTask_Service.DeleteSubTask($scope.TaskID);
            promiseDelete.then(function (pl) {
                $scope.Message = "Task Deleted Successfuly";
                GetAllTaskRecords();

            }, function (err) {
               // console.log("Some Error Occured." + err);
            });


        }

    }  
    

    $scope.AddItem = function () {
        var d = new Date();
        var tid = Math.floor(Math.random() * 1000) + 1;
        
        var item = {
            Task_ID: tid,
            Title: $scope.TaskTitle,
            Description: $scope.txtDesc,
            SubTask_ID: 0,
            TaskdueDate: $scope.duedate,
            Task_Status: $scope.txtStatus,
            StartDate: $scope.startdate,
            CreatedDate: d,
            AssignedTo: null,
            SubTask:null

        };
        //$scope.Tasks.push(item);  
        var promisePost = ERCTask_Service.AddTask(item);
        promisePost.then(function (pl) {
            GetAllTaskRecords();
           
            item = {};
            $scope.TaskTitle = "";
            $scope.txtDesc = "";
            $scope.duedate = "";
            $scope.txtStatus = "";
            $scope.startdate = "";
        }, function (err) {
           
        });
         
        
    }
    
    $scope.AddSubItem = function (id) {
        var d = new Date();
        var stid = $scope.TaskID ;
        var strTitle =  $scope.SubTaskTitle;
        var strDesc =  $scope.SubTaskDesc ;
        var strduedate =  $scope.subduedate4 ;
        var strstatus =  $scope.SubTaskStatus;
        var strstartdate =  $scope.startdate4 ;
        
        var itemsub = {
            Task_ID: stid,
            SubTask_ID: 0,
            Title: strTitle,
            Description: strDesc,
            TaskdueDate: strduedate,
            Task_Status: strstatus,
            StartDate: strstartdate,
            CreatedDate: d,
            AssignedTo: null
            
        };
        
        var promisePost = ERCTask_Service.AddSubTask(itemsub);
        promisePost.then(function (pl) {
            GetAllTaskRecords();

            item = {};
            $scope.mainTask = "";
            $scope.SubTaskTitle = "";
            $scope.txtSubTitle = "";
            $scope.SubTaskDesc = "";
            $scope.txtSubDesc = "";
            $scope.subduedate4 = "";
            $scope.subduedate = "";
            $scope.SubTaskStatus = "0";
            $scope.txtSubStatus = "0";
            $scope.startdate4 = "";
            $scope.startdate1 = "";
        }, function (err) {
           // console.log("Some error Occured" + err);
        });

 
    }    

    $scope.GetSubTaskDetail = function (id, type) {
        gid = id;
        gcat = type;
        var promiseGetSingle = ERCTask_Service.getSubTaskByID(id);
        promiseGetSingle.then(function (pl) {            
            var res = pl.data;            
            $scope.mainTask1 = res.Task_ID;
            $scope.txtSubTitle1 = res.Title;
            $scope.txtSubDesc1 = res.Description;
            $scope.txtSubStatus1 = res.Task_Status;
            $scope.subduedate1 = res.TaskDueDate;
            $scope.startdate2 = res.StartDate;           
        },
        function (errorPl) {           
        });        
    }

    $scope.GetTaskDetail = function (id, type) {
        gid = id;
        gcat = type;
        var promiseGetSingle = ERCTask_Service.getTaskByID(id);
        promiseGetSingle.then(function (pl) {
            var res = pl.data;            
            $scope.mainTask1 = res.Task_ID;
            $scope.txtSubTitle1 = res.Title;
            $scope.txtSubDesc1 = res.Description;
            $scope.subduedate1 = res.TaskDueDate;
            $scope.startdate2 = res.StartDate;
            $scope.txtSubStatus1 =  res.Task_Status;
            
        },
        function (errorPl) {
            
        });
        
    }
    
    $scope.EditItem = function () {

        var id = gid;
        alert(gid);
        if (gcat == 0) {

            var item = {
                Task_ID: id,
                Title: $scope.txtSubTitle1,
                Description: $scope.txtSubDesc1,
                TaskdueDate: $scope.subduedate1,
                Task_Status: $scope.txtSubStatus1,
                StartDate: $scope.startdate2,
               
                CreatedDate: null,
                AssignedTo: null,
            };
            alert(StartDate + "!!!!!!" + TaskdueDate);
            var promisePost = ERCTask_Service.EditTask(item);
            promisePost.then(function (pl) {
                GetAllTaskRecords();

            }, function (err) {

            });
        }
        else {
            var item = {
                Task_ID: id,
                Title: $scope.txtSubTitle1,
                Description: $scope.txtSubDesc1,
                TaskdueDate: $scope.subduedate1,
                Task_Status: $scope.txtSubStatus1,
                StartDate: $scope.startdate2,
                CreatedDate: null,
                AssignedTo: null,
            };
            var promisePost = ERCTask_Service.EditSubTask(item);
            promisePost.then(function (pl) {
                GetAllTaskRecords();

            }, function (err) {

            });
        }
        

    }
   
    ////To Delete Record  
    //$scope.DeleteTask = function () {
        
    //    var promiseDelete = ERCTask_Service.DeleteTask(id);
    //    promiseDelete.then(function (pl) {
    //        $scope.Message = "Task Deleted Successfuly";
    //        GetAllTaskRecords();
            
    //    }, function (err) {
           
    //    });
    //}

    $scope.fnPopId = function (id, cat) {
        $scope.TaskID = id;        
        gcat = cat;
        
       
    }

    
    //end of fuction

    $scope.set_class = function (compete) {
       
        if (compete >= 50 ) {
            return "progress-bar progress-bar-success";
        }
        else if (compete >= 30 && compete < 50) {
            return "progress-bar progress-bar-warning";
        }
        else return "progress-bar progress-bar-danger";
    }

    $scope.Set_Style = function (compete) {
        var ww = compete + '%';
        var ss = {"width":ww};
       
            return ss;
       
    }
    //calculate completion percentage
  $scope.CalculateCompletion = function(duedate, startdate)
    {
        duedate = new Date(duedate);
        startdate = new Date(startdate);
        var currentDate = new Date();
      
        var d1 = currentDate.getTime() - startdate.getTime();
        var d2 = duedate.getTime() - startdate.getTime();
        var cal = parseFloat((d1 * 100) / d2) > 100.00 ? 100.00 : parseFloat((d1 * 100) / d2);
        var pct = d1 < 0 ? "Task not yet started." :  Math.round(cal) + "% Completed."
        
        return pct;
  }
  $scope.OcurrenceTime = [{ "oTime": "12 A.M", "id": 1 }, { "oTime": "12:30 A.M", "id": 2 }, { "oTime": "1 A.M", "id": 3 }, { "oTime": "1:30 A.M", "id": 4 }, { "oTime": "2 A.M", "id": 5 }, { "oTime": "2:30 A.M", "id": 6 }, { "oTime": "3 A.M", "id": 7 }, { "oTime": "3:30 A.M", "id": 8 }, { "oTime": "4 A.M", "id": 9 }, { "oTime": "4:30 A.M", "id": 10 }, { "oTime": "5 A.M", "id": 11 }, { "oTime": "5:30 A.M", "id": 12 }, { "oTime": "6 A.M", "id": 13 }, { "oTime": "6:30 A.M", "id": 14 }, { "oTime": "7 A.M", "id": 15 }, { "oTime": "7:30 A.M", "id": 16 }, { "oTime": "8 A.M", "id": 17 }, { "oTime": "8:30 A.M", "id": 18 }, { "oTime": "9 A.M", "id": 19 }, { "oTime": "9:30 A.M", "id": 20 }, { "oTime": "10 A.M", "id": 21 }, { "oTime": "10:30 A.M", "id": 22 }, { "oTime": "11 A.M", "id": 23 }, { "oTime": "11:30 A.M", "id": 24 }, { "oTime": "12 P.M", "id": 25 }, { "oTime": "12:30 P.M", "id": 26 }, { "oTime": "1 P.M", "id": 27 }, { "oTime": "1:30 P.M", "id": 28 }, { "oTime": "2 P.M", "id": 29 }, { "oTime": "2:30 P.M", "id": 30 }, { "oTime": "3 P.M", "id": 31 }, { "oTime": "3:30 P.M", "id": 32 }, { "oTime": "4 P.M", "id": 33 }, { "oTime": "4:30 P.M", "id": 34 }, { "oTime": "5 P.M", "id": 35 }, { "oTime": "5:30 P.M", "id": 36 }, { "oTime": "6 P.M", "id": 37 }, , { "oTime": "6:30 P.M", "id": 38 }, { "oTime": "7 P.M", "id": 39 }, { "oTime": "7:30 P.M", "id": 40 }, { "oTime": "8 P.M", "id": 41 }, { "oTime": "8:30 P.M", "id": 42 }, { "oTime": "9 P.M", "id": 43 }, { "oTime": "9:30 P.M", "id": 44 }, { "oTime": "10 P.M", "id": 45 }, { "oTime": "10:30 P.M", "id": 46 }, { "oTime": "11 P.M", "id": 47 }, { "oTime": "11:30 P.M", "id": 48 }];
  $scope.WeekDay = [{ "Name": "Sunday", "id": 1 }, { "Name": "Monday", "id": 2 }, { "Name": "Tuesday", "id": 3 }, { "Name": "Wednesday", "id": 4 }, { "Name": "Thursday", "id": 5 }, { "Name": "Friday", "id": 6 }, { "Name": "Saturday", "id": 7 }];
  $scope.Month = [{ "Name": "January", "id": 1 }, { "Name": "February", "id": 2 }, { "Name": "March", "id": 3 }, { "Name": "April", "id": 4 }, { "Name": "May", "id": 5 }, { "Name": "June", "id": 6 }, { "Name": "July", "id": 7 },  { "Name": "August", "id": 8 }, { "Name": "September", "id": 9 }, { "Name": "October", "id": 10 }, { "Name": "November", "id": 11 }, { "Name": "December", "id": 12 }];
  $scope.WeekNo = [{ "Name": "First" }, { "Name": "Second" }, { "Name": "Third" }, { "Name": "Fourth" }, { "Name": "Last" }];
  $scope.showhide = function (type) {

      if (type == "Weekly") {
          $scope.isWeekly = true;
          $scope.isMonthly = false;
          $scope.isDaily = false;
          $scope.isYearly = false;
          $scope.Daily = "";
          $scope.Monthly = "";
          $scope.Yearly = "";
      }

      if (type == "Daily") {
          $scope.isDaily = true;
          $scope.isWeekly = false;
          $scope.isMonthly = false;
          $scope.isYearly = false;
          $scope.Weekly = "";
          $scope.Monthly = "";
          $scope.Yearly = "";
      }


      if (type == "Monthly") {
          $scope.isWeekly = false;
          $scope.isMonthly = true;
          $scope.isYearly = false;
          $scope.Weekly = "";
          $scope.Daily = "";
          $scope.Yearly = "";
          $scope.isDaily = false;
      }


      if (type == "Yearly") {
          $scope.isWeekly = false;
          $scope.isMonthly = false;
          $scope.isDaily = false;
          $scope.isYearly = true;
          $scope.Weekly = "";
          $scope.Daily = "";
          $scope.Monthly = "";
      }

  };
  $scope.selectionWeek = [];
  $scope.selectionMonth = [];
  $scope.toggleSelectionWeek = function toggleSelectionWeek(weekname) {
      var idx = $scope.selectionWeek.indexOf(weekname);

      // is currently selected
      if (idx > -1) {
          $scope.selectionWeek.splice(idx, 1);
      }

          // is newly selected
      else {
          $scope.selectionWeek.push(weekname);
      }
  }

  $scope.toggleSelectionMonth = function toggleSelectionMonth(monthname) {
      var idx = $scope.selectionMonth.indexOf(monthname);

      // is currently selected
      if (idx > -1) {
          $scope.selectionMonth.splice(idx, 1);
      }

          // is newly selected
      else {
          $scope.selectionMonth.push(monthname);
      }
  }
    //function to add reccurrence
  
  $scope.AddRecurrence = function () {
      
      var type = "", rangeType = "", fallon = "", InternalRadioOption = "", DayInterval = "", MonthInterval = "", WeekNumber = "", WeekDayName = "", MonthName = "";
      $scope.WeekRecurEvery = $("#WeekRecurEvery").val();
    
      if ($scope.Daily != "") {
          type = "Daily";
          if ($scope.DailyEvery == 0 && $scope.DailyEvery != "") {
              InternalRadioOption = 0;
              DayInterval = $scope.DailyEveryDay;
          }
          else if ($scope.DailyWeekday == 1 && $scope.DailyWeekday != "") {
              InternalRadioOption = 1;
              DayInterval = "";
          }
      }
      else if ($scope.Monthly != "") {
          type = "Monthly";
          
          if ($scope.MonthDay == 0 && $scope.MonthDay != "") {
              InternalRadioOption = 0;
              DayInterval = $scope.MonthDaytxt;
              MonthInterval = $scope.MonthEvery;
              WeekNumber = "";
              WeekDayName = "";
              MonthName = "";
          }
          else if ($scope.TheMonth == 1 && $scope.TheMonth != "") {
              InternalRadioOption = 1;
              MonthInterval = "";
              DayInterval = "";              
              WeekNumber = $scope.MonthWeekNo;
              WeekDayName = $scope.MonthWeek;
          }
      }
      else if ($scope.Weekly != "") {
          type = "Weekly";
          fallon = $scope.selectionWeek;
      }
      else if ($scope.Yearly != "") {
          
          type = "Yearly";
          if ($scope.YearlyEvery == 0 && $scope.YearlyEvery != "") {              
              InternalRadioOption = 0;
              DayInterval = $scope.YearInterval;
              MonthInterval = "";
              WeekNumber = "";
              WeekDayName = "";
              MonthName = $scope.Yearlymonth;
          }
          else if ($scope.TheYear == 1 && $scope.TheYear != "") {
              InternalRadioOption = 1;
              MonthInterval = "";
              DayInterval = "";
              WeekNumber = $scope.YearWeekNo;
              WeekDayName = $scope.YearlyWeek;
              MonthName = $scope.YearlymonthLast;
             
          }
      }
      
     
      if ($scope.NoEndDate == "No End Date") rangeType = "No End Date";
      if ($scope.EndAfterDigit == "End After") rangeType = "End After";
      if ($scope.EndAfter == "EndAfter" && $scope.subduedate6 != "") rangeType = "End After Date";
      
      var item = {
          Task_ID: $scope.TaskID,
          AppointmentStartTime: $scope.appStartTime,
          AppointmentEndTime: $scope.appEndTime,
          RecurrencePatternType: type,
          RecurrencePatternInterval: $scope.WeekRecurEvery,
          RecurrencePatternFallOn: JSON.stringify(fallon),
          RecurrenceRangeStartDate: $scope.subduedate5,
          RecurrenceRangeEndByDate: $scope.subduedate6,
          RecurrenceRangeType: rangeType,
          RecurrenceRangeOccurrence: $scope.EndAfterText,
          InternalRadioOption: InternalRadioOption,
          DayInterval : DayInterval,
          MonthInterval: MonthInterval,
          WeekNumber: WeekNumber,
          WeekDayName: WeekDayName,
          MonthName: MonthName

      };
      
      var promisePost = ERCTask_Service.AddReccurrence(item);
      promisePost.then(function (pl) {
          GetAllTaskRecords();

          item = {};
          $scope.appStartTime = "";
          $scope.appEndTime = "";
          $scope.WeekRecur = "";
          $scope.selectionWeek = null;
          $scope.selectionMonth = null;
          
      }, function (err) {
          
      });

  }
  $scope.RemoveRecurrence = function () {
     
      var item = {
          Task_ID: $scope.TaskID,
          AppointmentStartTime: "",
          AppointmentEndTime: "",
          RecurrencePatternType: "",
          RecurrencePatternInterval: "",
          RecurrencePatternFallOn: "",
          RecurrenceRangeStartDate: "",
          RecurrenceRangeEndByDate: "",
          RecurrenceRangeType: "",
          RecurrenceRangeOccurrence: ""

      };

      var promisePost = ERCTask_Service.AddReccurrence(item);
      promisePost.then(function (pl) {
          GetAllTaskRecords();       

      }, function (err) {
         
      });
  }

  $scope.CountTime = function () {
      $scope.appDurationTime = parseFloat(($scope.appEndTime - $scope.appStartTime) / 2) + " hrs";
  }

  $scope.RecurrenceDetail = function (id) {
      var TaskID = id;
      $scope.TaskID = id;
      $scope.selectionWeek = [];
      $scope.selectionMonth = [];
      $scope.appStartTime = 1;
      $scope.appEndTime = 4;
      
      for (var i = 0; i < $scope.Tasks.length; i++)
      {
          if($scope.Tasks[i].Task_ID == TaskID)
          {
            
              $scope.appStartTime = parseInt( $scope.Tasks[i].AppointmentStartTime);
              $scope.appEndTime = parseInt($scope.Tasks[i].AppointmentEndTime);
              $scope.EndAfterText = $scope.Tasks[i].RecurrenceRangeOccurrence;
              $scope.WeekRecurEvery = $scope.Tasks[i].RecurrencePatternInterval;
              if ($scope.Tasks[i].RecurrencePatternType == "Daily")
              {
                  $scope.Daily = $scope.Tasks[i].RecurrencePatternType;
                  $scope.isWeekly = false;
                  $scope.isMonthly = false;
                  $scope.isDaily = true;
                  $scope.isYearly = false;
                  if ($scope.Tasks[i].InternalRadioOption == 0) {
                      $scope.DailyEvery = "0";
                      $scope.DailyEveryDay = $scope.Tasks[i].DayInterval;
                  }
                  
                  else if ($scope.Tasks[i].InternalRadioOption  == 1) {                     
                      $scope.DailyWeekday == "1"
                  }
              }

              if ($scope.Tasks[i].RecurrencePatternType == "Weekly")
              {
                  $scope.Weekly = $scope.Tasks[i].RecurrencePatternType;                 
                  $scope.isWeekly = true;
                  $scope.isMonthly = false;
                  $scope.isDaily = false;
                  $scope.isYearly = false;
                  var jweek = JSON.parse($scope.Tasks[i].RecurrencePatternFallOn);                 
                  for (var j = 0; j < jweek.length; j++) {                    
                      
                      $scope.toggleSelectionWeek(jweek[j]);                    
                      
                  }

                 
              }
              if ($scope.Tasks[i].RecurrencePatternType == "Monthly") {
                  $scope.Monthly = $scope.Tasks[i].RecurrencePatternType;
                  $scope.isWeekly = false;
                  $scope.isMonthly = true;
                  $scope.isDaily = false;
                  $scope.isYearly = false;
                  if ($scope.Tasks[i].InternalRadioOption == 0) {
                      $scope.MonthDay == "0";
                      $scope.MonthDaytxt = $scope.Tasks[i].DayInterval ;
                      $scope.MonthEvery = $scope.Tasks[i].MonthInterval;
                  }

                  else if ($scope.Tasks[i].InternalRadioOption == 1) {
                      $scope.TheMonth == "1"
                      $scope.MonthWeekNo = $scope.Tasks[i].WeekNumber;
                      $scope.MonthWeek = $scope.Tasks[i].WeekDayName;
                  }
                  
              }
              if ($scope.Tasks[i].RecurrencePatternType == "Yearly") {
                  $scope.Yearly = $scope.Tasks[i].RecurrencePatternType;
                  $scope.isWeekly = false;
                  $scope.isMonthly = false;
                  $scope.isDaily = false;
                  $scope.isYearly = true;
                  if ($scope.Tasks[i].InternalRadioOption == 0) {
                      $scope.YearlyEvery = "0";                      
                      $scope.YearInterval = $scope.Tasks[i].DayInterval;                     
                      $scope.Yearlymonth = $scope.Tasks[i].MonthName;
                  }
                  else if ($scope.Tasks[i].InternalRadioOption == 1) {
                      $scope.TheYear = "1";                    
                      $scope.YearWeekNo = $scope.Tasks[i].WeekNumber;
                      $scope.YearlyWeek = $scope.Tasks[i].WeekDayName;
                      $scope.YearlymonthLast = $scope.Tasks[i].MonthName;
                  }

              }             
              $scope.subduedate5 = $scope.Tasks[i].RecurrenceRangeStartDate;
              $scope.subduedate6 = $scope.Tasks[i].RecurrenceRangeEndByDate;
              $scope.EndAfterDigit = $scope.Tasks[i].RecurrenceRangeOccurrence;
              var rtype = $scope.Tasks[i].RecurrenceRangeType;
              if (rtype == "No End Date") $scope.NoEndDate = rtype;
              if (rtype == "End After") $scope.EndAfterDigit = rtype;
              if (rtype == "End After Date") $scope.EndAfter = rtype;
              $scope.appDurationTime = parseFloat(($scope.appEndTime - $scope.appStartTime) / 2) + " hrs";
          }
      }
  }
  $scope.SaveAssignment = function () {
     
      var item = {
          TaskId: $scope.TaskID,
          AssignedTo: $scope.username,
          Comment: $scope.txtComment,
          AssignedBy: $("#hdnusername").val()
      };
      if (gcat == 0) {
          var promisePost = ERCTask_Service.AddAssignment(item);
          promisePost.then(function (pl) {
              GetAllTaskRecords();

              item = {};
              $scope.txtComment = "";

          }, function (err) {

          });
      }
      else {
          var promisePost = ERCTask_Service.AddSubTaskAssignment(item);
          promisePost.then(function (pl) {
              GetAllTaskRecords();
              item = {};
              $scope.txtComment = "";

          }, function (err) {

          });
      }

  }



 
  $scope.$watch('startdate', function (newval, oldval) {
      if (new Date($scope.duedate) < new Date($scope.startdate)) {
          $scope.startdate = '';
      };
  });

  $scope.$watch('duedate', function (newval, oldval) {
      if (new Date($scope.duedate) < new Date($scope.startdate)) {
          $scope.duedate = '';
      };
  });

  $scope.$watch('startdate2', function (newval, oldval) {
      if (new Date($scope.subduedate1.split(' ')[0]) < new Date($scope.startdate2.split(' ')[0])) {
          $scope.startdate2 = '';
      };
  });

  $scope.$watch('subduedate1', function (newval, oldval) {

      if (new Date($scope.subduedate1.split(' ')[0]) < new Date($scope.startdate2.split(' ')[0])) {
          $scope.subduedate1 = '';
      };
  });




  $scope.fnPopUser = function (id, type) {
      $scope.TaskID = id;
      gcat = type;
  }
  $scope.fnAssignValue = function (type, option) {
     
      if (type == "Yearly" && option == 0) {
          $scope.YearlyEvery = "0";
          $scope.TheYear = "";
      }
      if (type == "Yearly" && option == 1) {
          $scope.TheYear = "1";
          $scope.YearlyEvery = "";
          
      }

      if (type == "Daily" && option == 0) {
          $scope.DailyEvery = "0";
          $scope.DailyWeekday = "";
      }
      if (type == "Daily" && option == 1) {
          $scope.DailyWeekday = "1";
          $scope.DailyEvery = "";
      }
      if (type == "Monthly" && option == 0) {
          $scope.MonthDay = "0";
          $scope.TheMonth = "";
      }
      if (type == "Monthly" && option == 1) {
          $scope.TheMonth = "1";
          $scope.MonthDay = "";
      }
      }
});

