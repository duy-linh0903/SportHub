using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public enum UserStatus
    {
        Active = 0,
        Inactive = 1,
        Deleted = 2,
        Banned = 3
    }

    public class Users
    {
        [Key]
        public Guid Id { get; set; }
        [Required,MaxLength(50)]
        public string Name { get; set; }
        [MaxLength(20)]
        public string PhoneNumber { get; set; }
        [Required,EmailAddress]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string AvatarUrl { get; set; }
        [Required]
        public UserStatus Status { get; set; }
        public DateTime CreatedAt {  get; set; }
        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }
        public int OtpAttempts { get; set; } = 0;

        public Users()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.UtcNow;
        }
    }
}
