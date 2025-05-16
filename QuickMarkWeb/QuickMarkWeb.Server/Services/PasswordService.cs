using System.Security.Cryptography;
using System.Text;

namespace QuickMarkWeb.Server.Services
{
    public class PasswordService : IPasswordService
    {
        private const int KeySize = 64;
        private const int Iterations = 350000;
        private static readonly HashAlgorithmName HashAlgorithm = HashAlgorithmName.SHA512;

        public (string Hash, byte[] Salt) HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(KeySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                Iterations,
                HashAlgorithm,
                KeySize);
            return (Convert.ToHexString(hash), salt);
        }

        public bool VerifyPassword(string password, string hash, byte[] salt)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                HashAlgorithm,
                KeySize);
            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }
    }
}
