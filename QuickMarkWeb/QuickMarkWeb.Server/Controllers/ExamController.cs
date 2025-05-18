using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Models;
using Shared.Exam;
using QuickMarkWeb.Server.Helper;
using Shared.Questionnaire;
using System.Security.Claims;
using System.Text.Json;
using System.Text;

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
            //QoL: Location of exam would be nice in production

            var exams = await _context.Exams.ToListAsync();

            var examDTOs = exams.Select(e => e.ToExamDTO()).ToList();

            return Ok(examDTOs);
        }


        /// <summary>
        /// Helper function to let the examinor decide which questionnaire it would like to use for the new exam that is being created.
        /// </summary>
        /// <returns>All questionnaires uploaded previously</returns>
        [HttpGet("add/exam")]
        public async Task<ActionResult<IEnumerable<QuestionnaireDTO>>> GetQuestionnaires()
        {
            //QoL: identifier name would be better
            var questionnaires = await _context.Questionnaires.ToListAsync();

            var dtoList = questionnaires.Select(q => q.ToQuestionnaireDTO()).ToList();
            return Ok(dtoList);
        }


        [HttpPost("add/exam")]
        public async Task<ActionResult<ExamDTO>> AddExam([FromBody] NewExamRequest newExam)
        {
            if (!_context.Courses.Any(c => c.Code == newExam.CourseCode))
                return BadRequest("Exam is assigned to non-existing Course.");

            if (!_context.Questionnaires.Any(q => q.Id == newExam.QuestionnaireId))
                return BadRequest("Exam is assigned to non-existing questionnaire.");

            if (string.IsNullOrEmpty(newExam.AppliedStudents))
            {
                return BadRequest("No students were assigned to exam.");
            }

            if (newExam.HeldAt < DateTime.UtcNow)
            {
                return BadRequest("Exam must be held later than current time.");
            }

            if (newExam.QuestionAmount < 1)
            {
                return BadRequest("Exam must have at least one question.");
            }

            string[] limits = newExam.CorrectLimit.Split(';');

            if (limits.Any(l => Convert.ToInt32(l) > newExam.QuestionAmount))
            {
                return BadRequest("Exam rating values must be lower than the amount of questions generated.");
            }

            var exam = newExam.ToExamModel();
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            exam = await _context.Exams
                .Include(e => e.Course)
                .Include(e => e.User)
                .Include(e => e.Questionnaire)
                .FirstOrDefaultAsync(e => e.Id == exam.Id);

            return CreatedAtAction(nameof(GetAllExams), new { id = exam.Id }, exam.ToExamDTO());
        }

        [HttpPut("edit/exam/{id}")]
        public async Task<IActionResult> EditExam(int id, [FromBody] NewExamRequest editedExam)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return NotFound();

            exam.CourseId = editedExam.CourseCode;
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
            var selectedExam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == id);

            if (selectedExam == null) return NotFound();

            return Ok(selectedExam);
        }

        [HttpPost("exam/{id}/generatesheets")]
        public async Task<ActionResult<FileContentResult>> GenerateSheets(int id, [FromBody] ExamDTO request)
        {
            using var httpClient = new HttpClient();

            var flaskApiUrl = "http://localhost:5000/generate_exam_sheets";

            var jsonContent = JsonSerializer.Serialize(request);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            
            var response = await httpClient.PostAsync(flaskApiUrl, content);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, errorContent);
            }

            var pdfBytes = await response.Content.ReadAsByteArrayAsync();

            return File(pdfBytes, "application/pdf", $"exam_sheets_{id}.pdf");
        }
    }
}
