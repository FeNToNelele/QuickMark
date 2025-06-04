using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using Shared.Exam;
using QuickMarkWeb.Server.Helper;
using Shared.Questionnaire;
using Shared.Course;
using System.Security.Claims;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class CourseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CourseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CourseDTO>>> GetAllCourses()
        {
            var courses = await _context.Courses.ToListAsync();

            var courseDTOs = courses.Select(c => c.ToCourseDTO()).ToList();

            return Ok(courseDTOs);
        }

        [HttpPost]
        public async Task<ActionResult<CourseDTO>> PostCourse([FromBody] NewCourseRequest request)
        {
            if (string.IsNullOrEmpty(request.Code))
                return BadRequest("Course code cannot be empty.");
            if (string.IsNullOrEmpty(request.Name))
                return BadRequest("Course name cannot be empty.");

            var course = request.ToCourseModel();
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllCourses), new { id = course.Code }, course.ToCourseDTO());
        }

        [HttpPut("{courseCode}")]
        public async Task<ActionResult<CourseDTO>> EditCourse(string courseCode, [FromBody] NewCourseRequest request)
        {
            var editedCourse = await _context.Courses.FindAsync(courseCode);
            if (editedCourse == null) return NotFound();

            editedCourse.Code = request.Code;
            editedCourse.Name = request.Name;

            await _context.SaveChangesAsync();
            return Ok(editedCourse.ToCourseDTO());
        }

        [HttpDelete("{courseCode}")]
        [Authorize(Roles = "Admin")] // Only admins can delete.
        public async Task<IActionResult> DeleteCourse(string courseCode)
        {
            var courseToDelete = await _context.Courses.FindAsync(courseCode);
            if (courseToDelete == null)
            {
                return NotFound($"Course with code {courseCode} not found.");
            }
            var relatedExams = await _context.Exams.Where(e => e.CourseId == courseCode).ToListAsync();
            if (relatedExams.Any())
            {
                return BadRequest("Cannot delete course as it has associated exams.");
            }

            _context.Courses.Remove(courseToDelete);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content - sikeres törlés, nincs visszaadott tartalom
        }
    }
}
