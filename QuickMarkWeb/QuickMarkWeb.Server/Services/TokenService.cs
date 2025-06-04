using Microsoft.IdentityModel.Tokens;
using QuickMarkWeb.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public interface ITokenService
{
    TokenResult GenerateToken(User user);
}

public record TokenResult(string Token, DateTime Expiration);

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public TokenResult GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "Examinor"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration["JWT:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured")));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            claims: claims,
            //expires: DateTime.Now.AddHours(3),
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new TokenResult(
            new JwtSecurityTokenHandler().WriteToken(token),
            token.ValidTo);
    }
}