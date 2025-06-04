namespace QuickMarkWeb.Server.Services
{
    public interface IPasswordService
    {
        (string Hash, byte[] Salt) HashPassword(string password);
        bool VerifyPassword(string password, string hash, byte[] salt);
    }
}
