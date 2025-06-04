using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using QuickMarkWeb.Server.Data; // Az AppDbContext névtére
using QuickMarkWeb.Server.Helper;
using QuickMarkWeb.Server.Models; // A User modell névtére
using Shared.User;
using System.Security.Cryptography; // Jelszó hasheléshez
using System.Text; // String konverzióhoz

namespace QuickMarkWeb.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // Segédfüggvények a jelszó hasheléséhez és sózáshoz
        private static byte[] GenerateSalt()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] salt = new byte[16]; // 128 bit salt
                rng.GetBytes(salt);
                return salt;
            }
        }

        private static string HashPassword(string password, byte[] salt)
        {
            // PBKDF2 használata jelszó hashelésre, SHA256 algoritmussal és 10000 iterációval
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256))
            {
                byte[] hash = pbkdf2.GetBytes(20); // 160 bit hash (20 bytes)
                return Convert.ToBase64String(hash); // Base64 kódolás a string tároláshoz
            }
        }

        // GET: api/Users
        // Minden felhasználó lekérdezése (UserInfoDTO-ként, jelszó és só nélkül)
        [HttpGet]
        //public async Task<ActionResult<IEnumerable<UserInfoDTO>>> GetUsers()
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            //var users = await _context.Users
            //                          .Select(u => new UserInfoDTO
            //                          {
            //                              Username = u.Username,
            //                              FullName = u.FullName,
            //                              IsAdmin = u.IsAdmin
            //                          })
            //                          .ToListAsync();
            var users = await _context.Users.ToListAsync();
            var usersDTOs = users.Select(u => u.ToUserDTO()).ToList();

            return Ok(usersDTOs);
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUser([FromBody] NewUserRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || request.Username.Length != 6)
            {
                return BadRequest("Username (Neptun code) must be 6 characters long.");
            }
            if (string.IsNullOrEmpty(request.FullName))
            {
                return BadRequest("Full name is required.");
            }
            if (string.IsNullOrEmpty(request.Password) || request.Password.Length < 6)
            {
                return BadRequest("Password must be at least 6 characters long.");
            }

            // Check if another user is exists with this username.
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("This username is already in use!");
            }

            // Hash password and generate salt.
            byte[] salt = GenerateSalt();
            string hashedPassword = HashPassword(request.Password, salt);

            // Create database entity from DTO.
            var user = new User
            {
                Username = request.Username,
                FullName = request.FullName,
                Password = hashedPassword,
                Salt = salt,
                IsAdmin = request.IsAdmin
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Visszatérünk az újonnan létrehozott felhasználó adataival (jelszó és só nélkül)
            return CreatedAtAction(nameof(GetUsers), new { username = user.Username }, new UserDTO
            {
                Username = user.Username,
                FullName = user.FullName,
                IsAdmin = user.IsAdmin
            });
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<UserDTO>> GetUser(string username)
        {
            var user = await _context.Users.FindAsync(username);
        
            if (user == null)
            {
                return NotFound();
            }
        
            return new UserDTO
            {
                Username = user.Username,
                FullName = user.FullName,
                IsAdmin = user.IsAdmin
            };
        }

        

        // PUT: api/Users/{username}
        // Felhasználó adatainak frissítése (nem a jelszó és a só)
        [HttpPut("{username}")]
        public async Task<IActionResult> PutUser(string username, [FromBody] UserDTO request)
        {
            // Ellenőrizzük, hogy az URL-ben lévő username megegyezik-e a request body-ban lévővel
            //if (username != request.Username)
            //{
            //    return BadRequest("Username in URL and body do not match.");
            //}
            //
            var existingUser = await _context.Users.FindAsync(username);
            //if (existingUser == null)
            //{
            //    return NotFound($"User with username '{username}' not found.");
            //}
            if (existingUser == null) return NotFound();

            // Frissítjük a módosítható mezőket
            existingUser.FullName = request.FullName;
            existingUser.IsAdmin = request.IsAdmin;

            // Az EF Core figyeli a változásokat, elég SetModified-ra állítani az állapotot
           // _context.Entry(existingUser).State = EntityState.Modified;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!UserExists(username))
            //    {
            //        return NotFound(); // Valószínűleg már törölték a felhasználót
            //    }
            //    else
            //    {
            //        throw; // Valamilyen más adatbázis hiba történt
            //    }
            //}
            //
            //return NoContent(); // 204 No Content a sikeres frissítésre

            await _context.SaveChangesAsync();
            return Ok(existingUser.ToUserDTO());
        }

        [HttpDelete("{username}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var userToDelete = await _context.Users.FindAsync(username);
            if (userToDelete == null)
            {
                return NotFound($"User with username '{username}' not found.");
            }
            var relatedExams = await _context.Exams.Where(e => e.UserUsername == username).ToListAsync();
            if (await _context.Exams.AnyAsync(e => e.UserUsername == username))
            {
                 return BadRequest("Cannot delete user as they have associated exams.");
            }
            if (await _context.ExamResults.AnyAsync(er => er.UserUsername == username))
            {
                 return BadRequest("Cannot delete user as they have associated exam results.");
            }

            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();

            return NoContent(); // 204 No Content a sikeres törlésre
        }

        //// Segédfüggvény a felhasználó létezésének ellenőrzésére
        //private bool UserExists(string username)
        //{
        //    return _context.Users.Any(e => e.Username == username);
        //}
    }
}