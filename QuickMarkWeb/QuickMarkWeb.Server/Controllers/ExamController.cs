using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Models;

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
            var exams = _context.Exams
                .Include(e => e.Course)
                .Include(e => e.User)
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

            var questionnaires = _context.Questionnaires
                .Include(q => q.Id)
                .Include(q => q.CourseCode).ToList();

            return Ok(questionnaires);
        }


        [HttpPost("add/exam")]
        public async Task<IActionResult> AddExam([FromBody] Exam newExam)
        {
            var exam = new Exam
            {
                CourseCode = newExam.CourseCode,
                UserUsername = newExam.UserUsername,
                HeldAt = newExam.HeldAt,
                QuestionAmount = newExam.QuestionAmount,
                CorrectLimit = newExam.CorrectLimit, //if regular exam, multiple limits separated by comma
                AppliedStudents = newExam.AppliedStudents
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllExams), exam);
        }

        [HttpPut("edit/exam/{id}")]
        public async Task<IActionResult> EditExam(int id, [FromBody] Exam editedExam)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return NotFound();

            exam.CourseCode = editedExam.CourseCode;
            exam.HeldAt = editedExam.HeldAt;
            exam.QuestionAmount = editedExam.QuestionAmount;
            exam.CorrectLimit = editedExam.CorrectLimit;
            exam.AppliedStudents = editedExam.AppliedStudents;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
