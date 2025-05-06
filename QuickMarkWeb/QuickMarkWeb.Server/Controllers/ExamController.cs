using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Models;
using Shared.Exam;
using QuickMarkWeb.Server.Helper;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ExamController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExamController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("exams")]
        public IActionResult GetAllExams()
        {
            var currentUser = User.Identity.Name;

            //QoL: Location of exam would be nice in production

            var exams = _context.Exams
                .Where(e => e.UserUsername == currentUser)
                .Include(e => e.Id)
                .Include(e => e.Course)
                .Include(e => e.HeldAt)
                .ToList();

            return Ok(exams);
        }


        /// <summary>
        /// Helper function to let the examinor decide which questionnaire it would like to use for the new exam that is being created.
        /// </summary>
        /// <returns>All questionnaires uploaded previously</returns>
        [HttpGet("add/exam")]
        public async Task<IActionResult> GetQuestionnaires()
        {
            //QoL: identifier name would be better

            var questionnaires = _context.Questionnaires.ToListAsync();

            return Ok(questionnaires);
        }


        [HttpPost("add/exam")]
        public async Task<IActionResult> AddExam([FromBody] ExamDTO newExamDTO)
        {
            if (newExamDTO.CourseCode != newExamDTO.Questionnaire.CourseCode)
            {
                return BadRequest("Course code for new exam and its questionnaire must be the same.");
            }

            Exam exam = newExamDTO.ToExamModel();

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllExams), exam);
        }

        [HttpPut("edit/exam/{id}")]
        public async Task<IActionResult> EditExam([FromBody] ExamDTO editedExam)
        {
            var exam = await _context.Exams.FindAsync(editedExam.Id);
            if (exam == null) return NotFound();

            exam.CourseCode = editedExam.CourseCode;
            exam.HeldAt = editedExam.HeldAt;
            exam.QuestionAmount = editedExam.QuestionAmount;
            exam.CorrectLimit = editedExam.CorrectLimit;
            exam.AppliedStudents = editedExam.AppliedStudents;
            exam.Course = editedExam.Course.ToCourseModel();
            exam.HeldAt = editedExam.HeldAt;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("exam/{id}/generatesheets")]
        public async Task<IActionResult> GetGenerateSheets()
        {
            return NoContent();
        }

        [HttpPost("exam/{id}/generatesheets")]
        public async Task<IActionResult> GenerateSheets([FromBody] ExamDTO exam)
        {
            throw new NotImplementedException();
        }
    }
}
