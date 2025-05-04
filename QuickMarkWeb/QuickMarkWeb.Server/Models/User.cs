using System.ComponentModel.DataAnnotations;

namespace QuickMarkWeb.Server.Models
{
    public class User
    {
        [Key]
        [Required]
        public string Username { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public byte[] Salt { get; set; }
        public bool IsAdmin { get; set; }

        public List<Exam> Exams { get; set; }
        public List<ExamResult> ExamResults { get; set; }
    }
}
