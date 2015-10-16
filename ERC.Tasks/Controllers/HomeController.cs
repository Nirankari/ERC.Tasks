using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ERC.Tasks.Models;

namespace ERC.Tasks.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            
            ViewBag.Title = "ERC Task Tracker";
            
            if (string.IsNullOrEmpty(Convert.ToString(Session["username"]))) return RedirectToAction("Login", "Home");
            
            return View();
        }
        public ActionResult Login() {
            
            return View();
        }
        public string  Validate(user _obj1)
        {
            string returnval = string.Empty;
            user _obj = new user();
            try
            {
                _obj = TaskTracker.isValidateUser(_obj1.UserName, _obj1.DisplayName);
                Session["username"] = _obj.UserName;
                Session["DisplayName"] = "Welcome to " + (string.IsNullOrEmpty(Convert.ToString(_obj.DisplayName)) ? _obj.UserName : _obj.DisplayName);
                returnval = string.IsNullOrEmpty(Convert.ToString( _obj.UserName)) ? "no" : "ok";
                
            }
            catch (Exception ex) { returnval = "no"; }
            return returnval;
        }
        public ActionResult Logoff()
        {
            Session["username"] = "";
            Session.Abandon();
            return RedirectToAction("Login", "Home");
            
        }
    }
}
