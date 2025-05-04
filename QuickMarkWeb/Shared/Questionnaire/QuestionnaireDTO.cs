using QuickMarkWeb.Server.Models;
using QuickMarkWeb.Server.Shared.Exam;

namespace QuickMarkWeb.Server.Shared.Questionnaire
{
    public class QuestionnaireDTO
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public ExamDTO Exam { get; set; }
        public string GiftFile { get; set; }
        public string Answers { get; set; }
        public string CourseCode { get; set; }
    }
}
