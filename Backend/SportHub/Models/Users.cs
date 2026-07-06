using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public class Users
    {
        [Key]
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }
        [Required,EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime CreatedAt {  get; set; } = DateTime.Now;

    }
}
