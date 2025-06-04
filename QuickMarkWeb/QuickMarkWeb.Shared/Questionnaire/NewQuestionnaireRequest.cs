using Microsoft.AspNetCore.Http;

namespace Shared.Questionnaire
{
    public class NewQuestionnaireRequest
    {
        public IFormFile GiftFile { get; set; }
        public string CourseCode { get; set; }
    }
}
