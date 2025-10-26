namespace SecureApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }   // (demo only; we’ll hash later)
        public string? Role { get; set; }
    }
}
