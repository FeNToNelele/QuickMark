using System.ComponentModel.DataAnnotations;

namespace QuickMarkWeb.Server.Models
{
    public class Course
    {
        [Key]
        public string Code { get; set; }
        public string Name { get; set; }
    }
}
