using System.ComponentModel.DataAnnotations.Schema;

namespace QuickMarkWeb.Server.Models
{
    public class Questionnaire
    {
        public int Id { get; set; }
        public string GiftFile { get; set; }
        public string Answers { get; set; }
        public string CourseCode { get; set; }

        public Course Course { get; set; }
    }
}
