using Microsoft.AspNetCore.Mvc;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : Controller
    {
        [HttpGet("/healthz")]
        public IActionResult Health() => Ok("healthy");
    }
}
