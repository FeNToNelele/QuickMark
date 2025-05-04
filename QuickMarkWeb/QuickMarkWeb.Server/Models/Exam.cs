using System.ComponentModel.DataAnnotations.Schema;

namespace QuickMarkWeb.Server.Models
{
    public class Exam
    {
        public int Id { get; set; }

        [ForeignKey("Course")]
        public string CourseCode { get; set; }
        public Course Course { get; set; }

        [ForeignKey("User")]
        public string UserUsername { get; set; }
        public User User { get; set; }

        public DateTime HeldAt { get; set; }

        [ForeignKey("Questionnaire")]
        public int QuestionnaireId { get; set; }
        public Questionnaire Questionnaire { get; set; }

        public int QuestionAmount { get; set; }
        public string CorrectLimit { get; set; } //if regular exam, multiple limits separated by comma
        public string AppliedStudents { get; set; }

        public List<ExamResult> ExamResults { get; set; }
    }
}
