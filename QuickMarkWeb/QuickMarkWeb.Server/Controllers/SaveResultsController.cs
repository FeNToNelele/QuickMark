using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Helper;
using QuickMarkWeb.Server.Models;
using Shared.ExamResult;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class SaveResultsController : Controller
    {
        private readonly AppDbContext _context;

        public SaveResultsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<ActionResult<ExamResultDTO>> SaveExamResult([FromBody] NewExamResultRequest request)
        {
            if (request.CorrectAnswers < 0) return BadRequest("Number of correct answers must be value of 0 or higher.");

            var examQuestionAmount = await _context.Exams.FirstOrDefaultAsync(e => e.Id == request.ExamId);
            if (examQuestionAmount == null) return BadRequest("Invalid exam id.");

            if (examQuestionAmount.QuestionAmount < request.CorrectAnswers)
                return BadRequest("Number of correct answers is higher than the amount of questions generated to this exam.");

            ExamResult examResult = request.ToExamResultModel();

            _context.ExamResults.Add(examResult);
            await _context.SaveChangesAsync();

            examResult = await _context.ExamResults
                .Include(er => er.Exam)
                    .ThenInclude(e => e.Course)
                .Include(er => er.Exam)
                    .ThenInclude(e => e.User)
                .Include(er => er.Exam)
                    .ThenInclude(e => e.Questionnaire)
                .Include(er => er.User)
                .FirstOrDefaultAsync(er => er.Id == examResult.Id);

            return Ok(examResult.ToExamResultDTO());
        }
    }
}
