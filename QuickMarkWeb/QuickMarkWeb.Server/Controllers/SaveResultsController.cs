using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Helper;
using QuickMarkWeb.Server.Models;
using Shared.ExamResult;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class SaveResultsController : Controller
    {
        private readonly AppDbContext _context;

        public SaveResultsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveExamResult([FromBody] NewExamResultRequest request)
        {
            ExamResult examResult = request.ToExamResultModel();

            _context.ExamResults.Add(examResult);
            await _context.SaveChangesAsync();

            return Ok(examResult);
        }
    }
}
