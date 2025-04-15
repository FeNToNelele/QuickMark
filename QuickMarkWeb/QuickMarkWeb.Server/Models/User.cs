using System.ComponentModel.DataAnnotations;

namespace QuickMarkWeb.Server.Models
{
    public class User
    {
        [Key]
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
    }
}
