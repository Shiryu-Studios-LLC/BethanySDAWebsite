using System;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;

using HHBW.Models;
using Microsoft.AspNetCore.Mvc;

namespace HHBW.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;

        }

        public IActionResult Index()
        {
            Utils.curPage = "Home";
            return View();
        }

        public IActionResult AboutUs()
        {
            Utils.curPage = "AboutUs";
            return View();
        }

        public IActionResult Typography()
        {
            Utils.curPage = "Typography";
            return View();
        }

        public IActionResult Contacts()
        {
            Utils.curPage = "Contacts";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}