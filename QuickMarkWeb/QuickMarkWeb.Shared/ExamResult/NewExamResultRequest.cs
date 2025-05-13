namespace Shared.ExamResult
{
    public class NewExamResultRequest
    {
        public int ExamId { get; set; }
        public string ExamineeNeptunCode { get; set; }
        public string UserUsername { get; set; }
        public int CorrectAnswers { get; set; }
    }
}
