using System.ComponentModel.DataAnnotations.Schema;

namespace QuickMarkWeb.Server.Models
{
    public class Exam
    {
        public int Id { get; set; }

        [ForeignKey("Course")]
        public string CourseId { get; set; }
        public Course Course { get; set; }

        [ForeignKey("User")]
        public string UserUsername { get; set; }
        public User User { get; set; }

        public DateTime HeldAt { get; set; }
        public int QuestionAmount { get; set; }
        public int CorrectLimit { get; set; }
        public string AppliedStudents { get; set; }
    }
}
