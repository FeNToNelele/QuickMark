using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.User;

namespace Shared.Auth;

public class AuthResponseDTO
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public UserInfoDTO User { get; set; } = null!;
}
