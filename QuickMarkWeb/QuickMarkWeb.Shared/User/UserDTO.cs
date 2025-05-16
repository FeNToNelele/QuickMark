namespace Shared.User
{
    public class UserDTO
    {
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; }
        public string Password { get; set; } = string.Empty;
        public byte[]? Salt { get; set; }
        public bool IsAdmin { get; set; }
    }
}
