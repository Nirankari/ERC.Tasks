using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using ERC.Tasks.Models;
using System.Web.Cors;
using System.Web.Http.Cors;

namespace ERC.Tasks.Controllers
{
    public class TasksController : ApiController
    {
        
       [EnableCors(origins: "*", headers: "*", methods: "*")]
        // GET: api/Tasks
       [System.Web.Http.Route("api/GetAllTasks")]
       [System.Web.Http.HttpGet]
        public List<TaskTracker> GetAllTasks()
        {
            TaskTracker _obj = new TaskTracker();
            var _lst = _obj.GetTaskAndSubTask();
            return _lst;
        }

       [System.Web.Http.Route("api/GetAllUsers")]
       [System.Web.Http.HttpGet]
       public List<user> GetAllUsers()
        {
            var _lst = TaskTracker.GetAllUser();
            return _lst;
        }


        
        // GET: api/Tasks/5
       [System.Web.Http.Route("api/GetTaskByID/{id}")]
       [System.Web.Http.HttpGet]
       public TaskTracker  GetTaskByID(int id)
        {
            TaskTracker _obj = new TaskTracker();

            return  _obj.GetTaskByID(id);           

            
        }

       [System.Web.Http.Route("api/GetSubTaskByID/{id}")]
       [System.Web.Http.HttpGet]
       public TaskTracker GetSubTaskByID(int id)
       {
           TaskTracker _obj = new TaskTracker();

           return _obj.GetSubTaskByID(id);


       }
       
        // PUT: api/Tasks/5
       [System.Web.Http.Route("api/EditTask")]
       [System.Web.Http.HttpPut]
       public IHttpActionResult EditTask(TaskTracker _obj)
        {
            TaskTracker _objTask = new TaskTracker();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            try {
                _objTask.UpdateTask(_obj.Task_ID, _obj.Title, _obj.Description, Convert.ToDateTime( _obj.TaskDueDate), _obj.Task_Status, Convert.ToDateTime( _obj.StartDate));
            }
            catch (Exception ex) { }
           
            return StatusCode(HttpStatusCode.NoContent);
        }

       [System.Web.Http.Route("api/EditSubTask")]
       [System.Web.Http.HttpPut]
       public IHttpActionResult EditSubTask(TaskTracker _obj)
       {
           TaskTracker _objTask = new TaskTracker();
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }

           try
           {
               _objTask.UpdateSubTask(_obj.Task_ID, _obj.Title, _obj.Description, Convert.ToDateTime(_obj.TaskDueDate), _obj.Task_Status, Convert.ToDateTime(_obj.StartDate));
           }
           catch (Exception ex) { }

           return StatusCode(HttpStatusCode.NoContent);
       }

       
        // POST: api/Tasks
       [System.Web.Http.Route("api/AddTask")]
       [System.Web.Http.HttpPost]
       public string AddTask(TaskTracker _obj)
        {
            TaskTracker _objTask = new TaskTracker();
            try
            {
                _objTask.AddTask(_obj.Title, _obj.Description, Convert.ToDateTime(_obj.TaskDueDate), _obj.Task_Status, Convert.ToDateTime(_obj.StartDate));
            }
            catch (Exception ex) { return "error"; }
            return "ok";
        }

       [System.Web.Http.Route("api/AddSubTask")]
       [System.Web.Http.HttpPost]
       public string AddSubTask(TaskTracker _obj)
       {
           TaskTracker _objTask = new TaskTracker();
           try
           {
               _objTask.AddSubTask(_obj.Title, _obj.Description, Convert.ToDateTime(_obj.TaskDueDate), _obj.Task_Status, _obj.Task_ID, Convert.ToDateTime(_obj.StartDate));
           }
           catch (Exception ex) { return "error"; }
           return "ok";
       }

       [System.Web.Http.Route("api/AddReccurence")]
       [System.Web.Http.HttpPost]
       public string AddReccurrence(TaskTracker _obj)
       {
           TaskTracker _objTask = new TaskTracker();
           try
           {
               _objTask.AddReccurrence(_obj.Task_ID, _obj.InternalRadioOption, _obj.DayInterval, _obj.MonthInterval, _obj.WeekNumber, _obj.WeekDayName, _obj.MonthName ,_obj.AppointmentStartTime, _obj.AppointmentEndTime, _obj.RecurrencePatternType, _obj.RecurrencePatternInterval, _obj.RecurrencePatternFallOn,  _obj.RecurrenceRangeStartDate, _obj.RecurrenceRangeEndByDate, _obj.RecurrenceRangeType, _obj.RecurrenceRangeOccurrence);
           }
           catch (Exception ex) { return "error"; }
           return "ok";
       }

        // DELETE: api/Tasks/5
       [System.Web.Http.Route("api/DeleteTasks/{id}")]
       [System.Web.Http.HttpDelete]
        public IHttpActionResult DeleteTasks(int id)
        {
           
            if (id == 0)
            {
                return NotFound();
            }

            TaskTracker _objTask = new TaskTracker();
            _objTask.DeleteTask(id);
            return Ok("Deleted successfully.");
        }
       [System.Web.Http.Route("api/DeleteSubTasks/{id}")]
       [System.Web.Http.HttpDelete]
       public IHttpActionResult DeleteSubTasks(int id)
       {

           if (id == 0)
           {
               return NotFound();
           }

           TaskTracker _objTask = new TaskTracker();
           _objTask.DeleteSubTask(id);
           return Ok("Deleted successfully.");
       }
       // POST: api/AddAssignment
       [System.Web.Http.Route("api/AddAssignment")]
       [System.Web.Http.HttpPost]
       public IHttpActionResult AddAssignment(Assignment _objView)
       {
          
           TaskTracker _objTask = new TaskTracker();
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }
           _objTask.AddAssignment(_objView);
           return CreatedAtRoute("DefaultApi", new { id = _objView.TaskId }, _objView);
       }

         [System.Web.Http.Route("api/AddSubTaskAssignment")]
       [System.Web.Http.HttpPost]
       public IHttpActionResult AddSubTaskAssignment(Assignment _objView)
       {
          
           TaskTracker _objTask = new TaskTracker();
           if (!ModelState.IsValid)
           {
               return BadRequest(ModelState);
           }
           _objTask.AddSubTaskAssignment(_objView);
           return CreatedAtRoute("DefaultApi", new { id = _objView.TaskId }, _objView);
       }

      
    }
}