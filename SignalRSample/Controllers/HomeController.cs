using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRSample.Models;
using SignalRSample.Models.Order;
using SignalRSample.Models.Static;

namespace SignalRSample.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<DeathlyHallowsHub> _deathlyHub;
    private readonly IHubContext<OrderHub> _orderHub;
    private readonly ApplicationDbContext _context;

    public HomeController(ILogger<HomeController> logger,
        IHubContext<DeathlyHallowsHub> deathlyHub,
        IHubContext<OrderHub> orderHub,
        ApplicationDbContext context)
    {
        this._logger = logger;
        this._deathlyHub = deathlyHub;
        this._orderHub = orderHub;
        this._context = context;
    }

    public IActionResult Index()
    {
        return View();
    }
    
    public IActionResult BaseChat()
    {
        return View();
    }
    
    public IActionResult DeathlyHallowRace()
    {
        return View();
    }

    public IActionResult HarryPotterHouse()
    {
        return View();
    }

    public IActionResult Notification()
    {
        return View();
    }

    public async Task<IActionResult> DeathlyHallows(string type)
    {
        if (SD.DeathlyHallowRace.ContainsKey(type))
        {
            SD.DeathlyHallowRace[type]++;
        }

        await _deathlyHub.Clients.All.SendAsync("updateDeathlyHallowCount",
            SD.DeathlyHallowRace[SD.Cloak],
            SD.DeathlyHallowRace[SD.Stone],
            SD.DeathlyHallowRace[SD.Wand]);

        return Accepted();
    }

    #region Order
    [ActionName("Order")]
    public async Task<IActionResult> Order()
    {
        string[] name = { "Bhrugen", "Ben", "Jess", "Laura", "Ron" };
        string[] itemName = { "Food1", "Food2", "Food3", "Food4", "Food5" };

        Random rand = new Random();
        // Generate a random index less than the size of the array.  
        int index = rand.Next(name.Length);

        Order order = new Order()
        {
            Name = name[index],
            ItemName = itemName[index],
            Count = index
        };

        return View(order);
    }

    [ActionName("Order")]
    [HttpPost]
    public async Task<IActionResult> OrderPost(Order order)
    {

        _context.Order.Add(order);
        //_context.SaveChanges();
        await _context.SaveChangesAsync();
        await _orderHub.Clients.All.SendAsync("newOrder");
        return RedirectToAction(nameof(Order));
    }
    [ActionName("OrderList")]
    public IActionResult OrderList()
    {
        return View();
    }
    [HttpGet]
    public IActionResult GetAllOrder()
    {
        var productList = _context.Order.ToList();
        return Json(new { data = productList });
    }
    #endregion

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
