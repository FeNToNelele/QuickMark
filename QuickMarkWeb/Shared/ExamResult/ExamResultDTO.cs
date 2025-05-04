using QuickMarkWeb.Server.Shared.Exam;
using QuickMarkWeb.Server.Shared.User;

namespace QuickMarkWeb.Server.Shared.ExamResult
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
