namespace Shared.ExamResult
{
    public class NewExamResultRequest
    {
        public int ExamId { get; set; }
        public string ExamineeNeptunCode { get; set; }
        public string UserUsername { get; set; } //examinor's neptun code
        public int CorrectAnswers { get; set; }
    }
}
