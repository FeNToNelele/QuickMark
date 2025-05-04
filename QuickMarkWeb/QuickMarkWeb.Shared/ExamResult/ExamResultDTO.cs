using Shared.Exam;
using Shared.User;

namespace Shared.ExamResult
{
    public class ExamResultDTO
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public ExamDTO Exam { get; set; }
        public string ExamineeNeptunCode { get; set; }
        public string UserUsername { get; set; }
        public UserDTO User { get; set; }
        public int CorrectAnswers { get; set; }
    }
}
