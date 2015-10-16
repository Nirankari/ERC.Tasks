using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Security;
using System.Web.SessionState;
using System.DirectoryServices.AccountManagement;
using System.DirectoryServices;
using System.DirectoryServices.ActiveDirectory;
using System.Web.Caching;
using System.Runtime.Caching ;
namespace ERC.Tasks.Models
{
    public class user
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
    }
    public class Assignment
    {
        public int TaskId { get; set; }
        public string AssignedTo { get; set; }
        public string Comment { get; set; }
        public string AssignedBy { get; set; }
    }
    public class TaskTracker
    {
        private static MemoryCache _cache = MemoryCache.Default;
        public static string domain = "erccollections.com";

        #region Get set method for task
        public int Task_ID { get; set; }
        public int SubTask_ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string TaskDueDate { get; set; }
        public user AssignedTo { get; set; }
        public string TaskAssignedTo { get; set; }
        public string CreatedDate { get; set; }
        public string Task_Status { get; set; }
        public string StartDate { get; set; }
        public string TaskAssignedBy { get; set; }
        //recurrence implementation
        public string AppointmentStartTime { get; set; }
        public string AppointmentEndTime { get; set; }
        public string RecurrencePatternType { get; set; }
        public int RecurrencePatternInterval { get; set; }
        public string RecurrencePatternFallOn { get; set; }
        public string RecurrenceRangeStartDate { get; set; }
        public string RecurrenceRangeEndByDate { get; set; }
        public string RecurrenceRangeType { get; set; }
        public int RecurrenceRangeOccurrence { get; set; }
        public string InternalRadioOption { get; set; }
        public string DayInterval { get; set; }
        public string MonthInterval { get; set; }
        public string WeekNumber { get; set; }
        public string WeekDayName { get; set; }
        public string MonthName { get; set; }
        #endregion

        public List<TaskTracker> SubTask { get; set; }

        #region Get Task List
        public List<TaskTracker> GetTaskAndSubTask()
        {

            List<TaskTracker> _lst = new List<TaskTracker>();
            using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
            {
                var q = @"SELECT Task_ID, Task_Title, InternalRadioOption, DayInterval, MonthInterval,WeekNumber,WeekDayName,MonthName, Task_Description, TaskAssignedTo, Task_DueDate, CreatedDate, AppointmentStartTime, AppointmentEndTime, RecurrencePatternType, RecurrencePatternInterval, RecurrencePatternFallOn, RecurrenceRangeStartDate, RecurrenceRangeEndByDate, RecurrenceRangeType, RecurrenceRangeOccurrence, TaskAssignedBy  FROM dbo.ERC_Tasks ORDER BY Task_ID DESC;";
                using (var dr = db.Query(q))
                {
                    while (dr.Read())
                    {
                        TaskTracker info = new TaskTracker();
                        info.Task_ID = Convert.ToInt32(dr[0].ToString());
                        info.Title = Convert.ToString(dr["Task_Title"]);
                        info.Description = Convert.ToString(dr["Task_Description"]);
                        info.TaskDueDate = Convert.ToString(dr["Task_DueDate"]);
                        info.CreatedDate = Convert.ToString(dr["CreatedDate"]);
                        info.AppointmentStartTime = dr["AppointmentStartTime"] as string ?? "";
                        info.AppointmentEndTime = dr["AppointmentEndTime"] as string ?? "";
                        info.RecurrencePatternType = dr["RecurrencePatternType"] as string ?? "";
                        info.RecurrencePatternInterval = dr["RecurrencePatternInterval"] as int? ?? 0;
                        info.RecurrencePatternFallOn = dr["RecurrencePatternFallOn"] as string ?? "";
                        info.RecurrenceRangeStartDate = dr["RecurrenceRangeStartDate"] as string ?? "";
                        info.RecurrenceRangeEndByDate = dr["RecurrenceRangeEndByDate"] as string ?? "";
                        info.RecurrenceRangeType = dr["RecurrenceRangeType"] as string ?? "";
                        info.RecurrenceRangeOccurrence = dr["RecurrenceRangeOccurrence"] as int? ?? 0;
                        info.TaskAssignedBy = Convert.ToString(dr["TaskAssignedBy"]) as string ?? "";
                        info.TaskAssignedTo = Convert.ToString(dr["TaskAssignedTo"]) as string ?? "";
                        info.InternalRadioOption = Convert.ToString(dr["InternalRadioOption"]) as string ?? "";
                        info.DayInterval = Convert.ToString(dr["DayInterval"]) as string ?? "";
                        info.MonthInterval = Convert.ToString(dr["MonthInterval"]) as string ?? "";
                        info.WeekNumber = Convert.ToString(dr["WeekNumber"]) as string ?? "";
                        info.WeekDayName = Convert.ToString(dr["WeekDayName"]) as string ?? "";
                        info.MonthName = Convert.ToString(dr["MonthName"]) as string ?? "";

                        info.SubTask = GetSubTaskList(Convert.ToInt32(dr[0].ToString()));
                        _lst.Add(info);
                    }
                }
            }
            if (_lst == null)
            {
                throw new Exception("No match data found ");
            }
            return _lst;
        }

        private List<TaskTracker> GetSubTaskList(int taskId)
        {

            List<TaskTracker> _lst = new List<TaskTracker>();
            using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
            {
                var q = @" EXEC USP_GetAllSubTaskByID @ID ";
                using (var dr = db.Query(q, new SqlParameter("@ID", taskId)))
                {
                    while (dr.Read())
                    {
                        TaskTracker info = new TaskTracker();
                        user usreinfo = new user();
                        usreinfo.UserName = Convert.ToString(dr["AssignedTo"]);
                        info.Task_ID = Convert.ToInt32(dr["Task_ID"].ToString());
                        info.SubTask_ID = Convert.ToInt32(dr["SubTask_ID"].ToString());
                        info.Title = Convert.ToString(dr["Task_Title"]);
                        info.Description = Convert.ToString(dr["Task_Description"]);
                        info.TaskDueDate = Convert.ToString(dr["TaskDueDate"]);
                        info.CreatedDate = Convert.ToString(dr["CreatedDate"]);
                        info.StartDate = Convert.ToString(dr["StartDate"]);
                        info.Task_Status = Convert.ToString(dr["Task_Status"]);
                        info.AssignedTo = usreinfo;
                        _lst.Add(info);
                    }
                }
            }
            if (_lst == null)
            {
                throw new Exception("No match data found ");
            }
            return _lst;
        }
        #endregion

        #region function to add Task
        public bool AddTask(string Task_Title, string Task_Description, DateTime Task_DueDate, string Task_Status, DateTime StartDate)
        {
            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"INSERT INTO ERC_Tasks(Task_Title, Task_Description, Task_DueDate, StartDate, Task_Status) VALUES(@Task_Title, @Task_Description, @Task_DueDate,@StartDate, @Task_Status)";
                    using (var dr = db.Query(q, new SqlParameter("@Task_Title", Task_Title), new SqlParameter("@Task_Description", Task_Description), new SqlParameter("@Task_DueDate", Task_DueDate), new SqlParameter("@StartDate", StartDate), new SqlParameter("@Task_Status", Task_Status)))
                    {


                    }
                }
            }

            catch (Exception ex) { return false; }
            return true;
        }
        #endregion

        #region function to update Task
        public bool UpdateTask(int Task_ID, string Task_Title, string Task_Description, DateTime Task_DueDate, string Task_Status, DateTime StartDate)
        {
            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"UPDATE ERC_Tasks SET Task_Title = @Task_Title, Task_Description = @Task_Description, Task_DueDate = @Task_DueDate, StartDate = @StartDate, Task_Status = @Task_Status WHERE Task_ID = @Task_ID";

                    using (var dr = db.Query(q, new SqlParameter("@Task_Title", Task_Title), new SqlParameter("@Task_Description", Task_Description), new SqlParameter("@Task_DueDate", Task_DueDate), new SqlParameter("@StartDate", StartDate), new SqlParameter("@Task_Status", Task_Status), new SqlParameter("@Task_ID", Task_ID)))
                    {


                    }
                }
            }

            catch (Exception ex) { return false; }
            return true;
        }
        #endregion

        #region function to update sub Task
        public bool UpdateSubTask(int Task_ID, string Task_Title, string Task_Description, DateTime Task_DueDate, string Task_Status, DateTime StartDate)
        {
            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"UPDATE ERC_SubTasks SET Task_Title = @Task_Title, Task_Description = @Task_Description, Task_DueDate = @Task_DueDate, StartDate = @StartDate, Task_Status = @Task_Status WHERE SubTask_ID = @Task_ID";

                    using (var dr = db.Query(q, new SqlParameter("@Task_Title", Task_Title), new SqlParameter("@Task_Description", Task_Description), new SqlParameter("@Task_DueDate", Task_DueDate), new SqlParameter("@StartDate", StartDate), new SqlParameter("@Task_Status", Task_Status), new SqlParameter("@Task_ID", Task_ID)))
                    {


                    }
                }
            }

            catch (Exception ex) { return false; }
            return true;
        }
        #endregion

        #region function to add sub Task
        public bool AddSubTask(string Task_Title, string Task_Description, DateTime Task_DueDate, string Task_Status, int Task_ID, DateTime StartDate)
        {
            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"INSERT INTO ERC_SubTasks(Task_Title, Task_Description, Task_DueDate, StartDate, Task_Status, Task_ID) VALUES(@Task_Title, @Task_Description, @Task_DueDate,@StartDate, @Task_Status, @Task_ID)";
                    using (var dr = db.Query(q, new SqlParameter("@Task_Title", Task_Title), new SqlParameter("@Task_Description", Task_Description),
                        new SqlParameter("@Task_DueDate", Task_DueDate), new SqlParameter("@StartDate", StartDate), new SqlParameter("@Task_Status", Task_Status), new SqlParameter("@Task_ID", Task_ID)))
                    {


                    }
                }
            }

            catch (Exception ex) { return false; }
            return true;
        }
        #endregion


        #region function to Get task by task id
        public TaskTracker GetTaskByID(int ID)
        {
            TaskTracker info = new TaskTracker();
            using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
            {
                var q = @"SELECT Task_ID, Task_Title, Task_Description, Task_DueDate, CreatedDate, StartDate, Task_Status FROM dbo.ERC_Tasks WHERE Task_ID = @ID;";
                using (var dr = db.Query(q, new SqlParameter("@ID", ID)))
                {
                    if (dr.Read())
                    {

                        info.Task_ID = Convert.ToInt32(dr[0].ToString());
                        info.Title = Convert.ToString(dr["Task_Title"]);
                        info.Description = Convert.ToString(dr["Task_Description"]);
                        info.TaskDueDate = Convert.ToString(dr["Task_DueDate"]);
                        info.CreatedDate = Convert.ToString(dr["CreatedDate"]);
                        info.StartDate = Convert.ToString(dr["StartDate"]);
                        info.Task_Status = Convert.ToString(dr["Task_Status"]);


                    }
                }
            }
            if (info == null)
            {
                throw new Exception("No match data found ");
            }
            return info;
        }
        #endregion


        #region function to Get sub task by task id
        public TaskTracker GetSubTaskByID(int ID)
        {
            TaskTracker info = new TaskTracker();
            using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
            {
                var q = @"SELECT SubTask_ID, Task_ID, Task_Title, Task_Description, Task_DueDate, CreatedDate, StartDate, Task_Status FROM dbo.ERC_SubTasks WHERE SubTask_ID = @ID;";
                using (var dr = db.Query(q, new SqlParameter("@ID", ID)))
                {
                    if (dr.Read())
                    {

                        info.SubTask_ID = Convert.ToInt32(dr[0].ToString());
                        info.Task_ID = Convert.ToInt32(dr["Task_ID"].ToString());
                        info.Title = Convert.ToString(dr["Task_Title"]);
                        info.Description = Convert.ToString(dr["Task_Description"]);
                        info.TaskDueDate = Convert.ToString(dr["Task_DueDate"]);
                        info.CreatedDate = Convert.ToString(dr["CreatedDate"]);
                        info.StartDate = Convert.ToString(dr["StartDate"]);
                        info.Task_Status = Convert.ToString(dr["Task_Status"]);

                    }
                }
            }
            if (info == null)
            {
                throw new Exception("No match data found ");
            }
            return info;
        }
        #endregion

        #region function to Delete task
        public bool DeleteTask(int ID)
        {
            using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
            {
                var q = @"EXEC USP_DeleteTask @ID;";
                using (var dr = db.Query(q, new SqlParameter("@ID", ID)))
                {
                    if (dr.Read())
                    {


                    }
                }
            }

            return true;
        }
        #endregion

        #region function to Delete sub task
        public bool DeleteSubTask(int ID)
        {
            using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
            {
                var q = @"DELETE FROM ERC_SubTasks WHERE SubTask_ID = @ID;";
                using (var dr = db.Query(q, new SqlParameter("@ID", ID)))
                {
                    if (dr.Read())
                    {


                    }
                }
            }

            return true;
        }
        #endregion

        #region function to add reccurrence
        public bool AddReccurrence(int Task_ID, string InternalRadioOption, string DayInterval, string MonthInterval, string WeekNumber, string WeekDayName, string MonthName, string AppointmentStartTime, string AppointmentEndTime, string RecurrencePatternType, int RecurrencePatternInterval, string RecurrencePatternFallOn, string RecurrenceRangeStartDate, string RecurrenceRangeEndByDate, string RecurrenceRangeType, int RecurrenceRangeOccurrence)
        {
            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"UPDATE ERC_Tasks SET InternalRadioOption = @InternalRadioOption, DayInterval = @DayInterval, MonthInterval = @MonthInterval,WeekNumber = @WeekNumber,WeekDayName = @WeekDayName,MonthName = @MonthName, AppointmentStartTime = @AppointmentStartTime, AppointmentEndTime = @AppointmentEndTime, RecurrencePatternType = @RecurrencePatternType, RecurrencePatternInterval = @RecurrencePatternInterval, RecurrencePatternFallOn = @RecurrencePatternFallOn, RecurrenceRangeStartDate = @RecurrenceRangeStartDate, RecurrenceRangeEndByDate = @RecurrenceRangeEndByDate, RecurrenceRangeType = @RecurrenceRangeType, RecurrenceRangeOccurrence = @RecurrenceRangeOccurrence   WHERE Task_ID = @Task_ID";

                    using (var dr = db.Query(q, new SqlParameter("@InternalRadioOption", InternalRadioOption), new SqlParameter("@DayInterval", DayInterval), new SqlParameter("@MonthInterval", MonthInterval), new SqlParameter("@WeekNumber", WeekNumber), new SqlParameter("@WeekDayName", WeekDayName), new SqlParameter("@MonthName", MonthName), new SqlParameter("@AppointmentStartTime", AppointmentStartTime), new SqlParameter("@AppointmentEndTime", AppointmentEndTime), new SqlParameter("@RecurrencePatternType", RecurrencePatternType), new SqlParameter("@RecurrencePatternInterval", RecurrencePatternInterval), new SqlParameter("@RecurrencePatternFallOn", RecurrencePatternFallOn), new SqlParameter("@RecurrenceRangeStartDate", RecurrenceRangeStartDate), new SqlParameter("@RecurrenceRangeEndByDate", RecurrenceRangeEndByDate), new SqlParameter("@RecurrenceRangeType", RecurrenceRangeType), new SqlParameter("@RecurrenceRangeOccurrence", RecurrenceRangeOccurrence), new SqlParameter("@Task_ID", Task_ID)))
                    {


                    }
                }
            }

            catch (Exception ex) { return false; }
            return true;
        }
        #endregion

        #region get users and validate


        public static user isValidateUser(string username, string password)
        {
            user _obj = new user();
            _obj.DisplayName = "Shrikant singh";
            _obj.UserName = "shrikant";
            //    using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain))
            //{
            //    if (pc.ValidateCredentials(username, password)) {
            //        _obj.UserName = username;
            //        _obj.DisplayName = GetUserDetails(username).DisplayName ;

            //    }

            //}

            return _obj;
        }
        //public static user isValidateUser(string username, string password)
        //{
        //    user _obj = new user();

        //    using (PrincipalContext pc = new PrincipalContext(ContextType.Domain, domain))
        //    {
        //        if (pc.ValidateCredentials(username, password))
        //        {
        //            _obj.UserName = username;
        //            _obj.DisplayName = "";

        //        }

        //    }

        //    return _obj;
        //}

        public static List<user> GetAllUser()
        {
            List<user> _lst = new List<user>();

            if (!_cache.Contains("ListUser")) RefreshCache();
            else _lst = _cache.Get("ListUser") as List<user>;
            return _lst.ToList();
        }

        #endregion

        #region function to do assignment
        public bool AddAssignment(Assignment _obj)
        {

            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"EXEC USP_AddAssignment @Task_ID, @TaskAssignedToUser, @TaskComment, @AssignedByUsername";
                    using (var dr = db.Query(q, new SqlParameter("@Task_ID", _obj.TaskId), new SqlParameter("@TaskAssignedToUser", _obj.AssignedTo), new SqlParameter("@TaskComment", _obj.Comment), new SqlParameter("@AssignedByUsername", _obj.AssignedBy)))
                    {


                    }
                }
            }
            catch (Exception ex) { }
            return true;
        }
        #endregion

        #region function to do sub task assignment
        public bool AddSubTaskAssignment(Assignment _obj)
        {
            try
            {
                using (var db = new SqlHelper(ConfigurationManager.ConnectionStrings["collect2000ConnectionString"].ConnectionString))
                {
                    var q = @"INSERT INTO ERC_TaskAssignment(SubTask_ID, AssignedToUsername, Task_Comment  ) VALUES(@Task_ID, @TaskAssignedToUser, @TaskComment)";
                    using (var dr = db.Query(q, new SqlParameter("@Task_ID", _obj.TaskId), new SqlParameter("@TaskAssignedToUser", _obj.AssignedTo), new SqlParameter("@TaskComment", _obj.Comment)))
                    {


                    }
                }
            }
            catch (Exception ex) { }
            return true;
        }
        #endregion

        public static void RefreshCache()
        {
            List<user> _lst = new List<user>();
            CacheItemPolicy itemPolicy = new CacheItemPolicy();
            itemPolicy.AbsoluteExpiration = DateTime.Now.AddDays(1);
            if (!_cache.Contains("ListUser"))
            {
                //using (var context = new PrincipalContext(ContextType.Domain, domain))
                //{
                //    using (var searcher = new PrincipalSearcher(new UserPrincipal(context)))
                //    {
                //        foreach (var result in searcher.FindAll())
                //        {
                //            user _obj = new user();
                //            DirectoryEntry de = result.GetUnderlyingObject() as DirectoryEntry;
                //            if (!string.IsNullOrEmpty(Convert.ToString(de.Properties["givenName"].Value)))
                //            {
                //                _obj.DisplayName = Convert.ToString(de.Properties["givenName"].Value) + " " + Convert.ToString(de.Properties["sn"].Value);
                //                _obj.UserName = Convert.ToString(de.Properties["samAccountName"].Value);

                //                _lst.Add(_obj);
                //            }
                //        }
                //    }
                user _obj = new user();
               
                _obj.DisplayName = "Sanyog Kesri";
                _obj.UserName = "Sanyog";
                _lst.Add(_obj);
            }
            _cache.Add("ListUser", _lst, itemPolicy);
        }


    }

}