using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Helper;
using QuickMarkWeb.Server.Models;
using Shared.Questionnaire;

namespace QuickMarkWeb.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuestionnaireController : Controller
    {
        private readonly AppDbContext _context;
        public QuestionnaireController(AppDbContext context)
        {
            _context = context;            
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuestionnaireDTO>>> GetQuestionnaires()
        {
            var questionnaires = await _context.Questionnaires.ToListAsync();

            var questionnaireDTOs = questionnaires.Select(q => q.ToQuestionnaireDTO()).ToList();

            return Ok(questionnaireDTOs);
        }

        [HttpGet("{courseCode}")]
        public async Task<ActionResult<IEnumerable<QuestionnaireDTO>>> GetQuestionnairesForCourse(string courseCode)
        {
            var course = _context.Courses.Where(c => c.Code == courseCode);
            if (!course.Any()) return BadRequest("Invalid course code.");

            var questionnaires = _context.Questionnaires.Where(q => q.CourseCode == courseCode);

            var questionnaireDTOs = questionnaires.Select(q => q.ToQuestionnaireDTO());

            return Ok(questionnaireDTOs);
        }


        [HttpPost]
        public async Task<ActionResult<QuestionnaireDTO>> PostQuestionnaire([FromForm] NewQuestionnaireRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.CourseCode)) return BadRequest("Questionnaire must be assigned to a Course");
                if (request.GiftFile == null) return BadRequest("GIFT file must be attached to request.");

                string giftFileContent;
                using (var reader = new StreamReader(request.GiftFile.OpenReadStream()))
                {
                    giftFileContent = await reader.ReadToEndAsync();
                }

                var newQuestionnaire = new Questionnaire
                {
                    CourseCode = request.CourseCode,
                    GiftFile = giftFileContent
                };

                _context.Questionnaires.Add(newQuestionnaire);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetQuestionnaires), new { id = newQuestionnaire.Id }, newQuestionnaire.ToQuestionnaireDTO());
            }
            catch (Exception ex)
            {
                Console.WriteLine("UploadGIFT exception: " + ex);
                throw;
            }
        }
    }
}
