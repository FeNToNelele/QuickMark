using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Models;
using Shared.Exam;
using QuickMarkWeb.Server.Helper;
using Shared.Questionnaire;

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
        public async Task<ActionResult<IEnumerable<ExamDTO>>> GetAllExams()
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
        public async Task<ActionResult<IEnumerable<QuestionnaireDTO>>> GetQuestionnaires()
        {
            //QoL: identifier name would be better
            var questionnaires = await _context.Questionnaires
                .Include(q => q.Exams)
                .ToListAsync();

            var dtoList = questionnaires.Select(q => q.ToQuestionnaireDTO()).ToList();
            return Ok(dtoList);
        }


        [HttpPost("add/exam")]
        public async Task<ActionResult<ExamDTO>> AddExam([FromBody] NewExamRequest newExam)
        {
            if (newExam.CourseCode != _context.Questionnaires.First(q => q.Id == newExam.QuestionnaireId).CourseCode)
            {
                return BadRequest("Course code mismatch.");
            }

            var exam = newExam.ToExamModel();
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllExams), new { id = exam.Id }, exam.ToExamDTO());
        }

        [HttpPut("edit/exam/{id}")]
        public async Task<IActionResult> EditExam(int id, [FromBody] NewExamRequest editedExam)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return NotFound();

            exam.CourseCode = editedExam.CourseCode;
            exam.HeldAt = editedExam.HeldAt;
            exam.QuestionAmount = editedExam.QuestionAmount;
            exam.CorrectLimit = editedExam.CorrectLimit;
            exam.AppliedStudents = editedExam.AppliedStudents;
            exam.Course = _context.Courses.FirstOrDefault(c => c.Code == editedExam.CourseCode);
            exam.HeldAt = editedExam.HeldAt;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        //TODO: Consider if this endpoint is needed
        [HttpGet("exam/{id}/generatesheets")]
        public async Task<ActionResult<ExamDTO>> GetGenerateSheets(int id)
        {
            var selectedExam = _context.Exams.FirstOrDefault(e => e.Id == id);

            if (selectedExam == null) return NotFound();

            return Ok(selectedExam);
        }

        [HttpPost("exam/{id}/generatesheets")]
        public async Task<ActionResult<FileContentResult>> GenerateSheets([FromBody] ExamDTO exam)
        {
            //TODO: forward request to Balazs's endpoint for generating exams

            //Should return a PDF file

            return NoContent();
        }
    }
}
