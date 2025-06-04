namespace QuickMarkWeb.Server.Models
{
    public class ExamResult
    {
        public int Id { get; set; }
        public int ExamId { get; set; }
        public Exam Exam { get; set; }
        public string ExamineeNeptunCode { get; set; }
        public string UserUsername { get; set; }
        public User User { get; set; }
        public int CorrectAnswers { get; set; }
    }
}
