using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Models;
using Shared.User;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace QuickMarkWeb.Server.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDTO user)
        {
            if (string.IsNullOrEmpty(user.Username))
                return BadRequest("Username is required");

            if (string.IsNullOrEmpty(user.Password))
                return BadRequest("Password is required");

            if (_context.Users.Any(u => u.Username == user.Username))
                return BadRequest("Username already exists");

            var passwordHash = HashPasword(user.Password, out var salt);

            var newUser = new User
            {
                Username = user.Username,
                FullName = user.FullName,
                Password = passwordHash,
                Salt = salt,
                IsAdmin = user.IsAdmin
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "User registered successfully." });
        }

        const int keySize = 64;
        const int iterations = 350000;
        static readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

        private static string HashPasword(string password, out byte[] salt)
        {
            salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                hashAlgorithm,
                keySize);
            return Convert.ToHexString(hash);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDTO loginRequest)
        {
            var user = await _context.Users.FindAsync(loginRequest.Username);

            if (user == null || !VerifyPassword(loginRequest.Password, user.Password, user.Salt))
                return Unauthorized("Invalid credentials");


            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "Examinor"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Generate token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                user = new
                {
                    user.Username,
                    user.FullName,
                    user.IsAdmin
                }
            });
        }

        bool VerifyPassword(string password, string hash, byte[] salt)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, hashAlgorithm, keySize);
            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }
    }
}
