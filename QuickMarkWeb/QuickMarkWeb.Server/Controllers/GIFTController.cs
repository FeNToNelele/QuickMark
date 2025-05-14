using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Helper;
using QuickMarkWeb.Server.Models;
using Shared.Questionnaire;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class GIFTController : Controller
    {
        private readonly AppDbContext _context;

        public GIFTController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("uploadgift/{id}")]
        public async Task<IActionResult> GetSelectedCourseDetails(string courseCode)
        {
            var selectedCourse = _context.Courses.FirstOrDefault(c => c.Code == courseCode);

            if (selectedCourse == null) return NotFound();

            return Ok(selectedCourse);
        }

        [HttpPost("uploadgift")]
        public async Task<IActionResult> UploadGIFT([FromBody] NewQuestionnaireRequest questionnaire)
        {
            Questionnaire newQuestionnaire = questionnaire.ToQuestionnaireModel();

            _context.Questionnaires.Add(newQuestionnaire);
            await _context.SaveChangesAsync();

            ExamController examController = new ExamController(this._context);

            return CreatedAtAction(nameof(examController.GetAllExams), questionnaire);
        }
    }
}
