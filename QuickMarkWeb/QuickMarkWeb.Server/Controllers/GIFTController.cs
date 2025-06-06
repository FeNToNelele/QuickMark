﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Helper;
using QuickMarkWeb.Server.Models;
using Shared.Course;
using Shared.Questionnaire;

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class GIFTController : Controller
    {
        private readonly AppDbContext _context;

        public GIFTController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("uploadgift/{courseCode}")]
        public async Task<ActionResult<CourseDTO>> GetSelectedCourseDetails(string courseCode)
        {
            var selectedCourse = _context.Courses.FirstOrDefault(c => c.Code == courseCode);

            if (selectedCourse == null) return NotFound();

            return Ok(selectedCourse.ToCourseDTO());
        }

        [HttpPost("uploadgift")]
        public async Task<ActionResult<QuestionnaireDTO>> UploadGIFT([FromForm] NewQuestionnaireRequest request)
        {
            try
            {
                if (request.GiftFile == null || request.GiftFile.Length == 0)
                    return BadRequest("No file uploaded.");

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

                var questionnaireDTO = newQuestionnaire.ToQuestionnaireDTO();

                return CreatedAtAction(
                    actionName: "GetAllExams",
                    controllerName: "Exam",
                    routeValues: null,
                    value: questionnaireDTO
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine("UploadGIFT exception: " + ex);
                throw;
            }
        }
    }
}
