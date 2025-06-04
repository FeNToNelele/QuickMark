using Shared.Course;
using Shared.Questionnaire;
using Shared.User;

namespace Shared.Exam
{
    public class ExamDTO
    {
        public int Id { get; set; }
        public string CourseCode { get; set; }
        public CourseDTO Course { get; set; }
        public string UserUsername { get; set; }
        public UserInfoDTO User { get; set; }
        public DateTime HeldAt { get; set; }
        public int QuestionnaireId { get; set; }
        public QuestionnaireDTO Questionnaire { get; set; }

        public int QuestionAmount { get; set; }
        public string CorrectLimit { get; set; } //if regular exam, multiple limits separated by comma
        public string AppliedStudents { get; set; }
    }
}
