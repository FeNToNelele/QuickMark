using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.User
{
    public class UserInfoDTO
    {
        public string Username { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public bool IsAdmin { get; set; }
    }
}
