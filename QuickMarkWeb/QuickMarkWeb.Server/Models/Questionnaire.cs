using System.ComponentModel.DataAnnotations.Schema;

namespace QuickMarkWeb.Server.Models
{
    public class Questionnaire
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public Exam Exam { get; set; }
        public string GiftFile { get; set; }
        public string Answers { get; set; }
        public string CourseCode { get; set; }
    }
}
