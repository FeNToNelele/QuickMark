using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Auth;

public class RegisterRequestDTO : AuthRequestDTO
{
    public RegisterRequestDTO(string username, string password, string? fullName = null)
    : base(username, password) // This calls the base constructor
    {
        FullName = fullName;
    }

    [StringLength(100)]
    public string? FullName { get; set; }

    public bool IsAdmin { get; set; } = false;



}
