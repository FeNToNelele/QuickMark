using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using QuickMarkWeb.Server.Data;
using QuickMarkWeb.Server.Models;
using QuickMarkWeb.Server.Services;
using Shared.Auth;
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
        private readonly ITokenService _tokenService;
        private readonly IPasswordService _passwordService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            AppDbContext context,
            ITokenService tokenService,
            IPasswordService passwordService,
            ILogger<AuthController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordService = passwordService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDTO>> Register([FromBody] RegisterRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                    return Conflict("Username already exists");

                var (hash, salt) = _passwordService.HashPassword(request.Password);

                var newUser = new User
                {
                    Username = request.Username,
                    FullName = request.FullName,
                    Password = hash,
                    Salt = salt,
                    IsAdmin = request.IsAdmin
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                _logger.LogInformation("New user registered: {Username}", request.Username);

                var token = _tokenService.GenerateToken(newUser);
                return Ok(new AuthResponseDTO
                {
                    Token = token.Token,
                    Expiration = token.Expiration,
                    User = new UserInfoDTO
                    {
                        Username = newUser.Username,
                        FullName = newUser.FullName,
                        IsAdmin = newUser.IsAdmin
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, "An error occurred during registration");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] AuthRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == request.Username);

                if (user == null || !_passwordService.VerifyPassword(
                    request.Password, user.Password, user.Salt))
                {
                    _logger.LogWarning("Failed login attempt for username: {Username}", request.Username);
                    return Unauthorized("Invalid credentials");
                }

                var token = _tokenService.GenerateToken(user);

                _logger.LogInformation("User logged in: {Username}", request.Username);

                return Ok(new AuthResponseDTO
                {
                    Token = token.Token,
                    Expiration = token.Expiration,
                    User = new UserInfoDTO
                    {
                        Username = user.Username,
                        FullName = user.FullName,
                        IsAdmin = user.IsAdmin
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, "An error occurred during login");
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            //In JWT logout is client-side: returning success
            return Ok(new { Message = "Logout successful" });
        }
    }
}
