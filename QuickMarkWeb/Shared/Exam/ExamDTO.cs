using QuickMarkWeb.Server.Models;
using QuickMarkWeb.Server.Shared.Course;
using QuickMarkWeb.Server.Shared.Questionnaire;
using QuickMarkWeb.Server.Shared.User;

namespace QuickMarkWeb.Server.Shared.Exam
{
    public class ExamDTO
    {
        public int Id { get; set; }
        public string CourseId { get; set; }
        public CourseDTO Course { get; set; }
        public string UserUsername { get; set; }
        public UserDTO User { get; set; }
        public DateTime HeldAt { get; set; }
        public int QuestionnaireId { get; set; }
        public QuestionnaireDTO Questionnaire { get; set; }

        public int QuestionAmount { get; set; }
        public string CorrectLimit { get; set; } //if regular exam, multiple limits separated by comma
        public string AppliedStudents { get; set; }
    }
}
