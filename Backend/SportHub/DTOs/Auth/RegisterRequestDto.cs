using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Auth
{
    public class RegisterRequestDto
    {
        [Required, StringLength(100)]
        public string Name { get; set; }
        [Required, Phone, StringLength(20)]
        public string PhoneNumber { get; set; }
        [Required, EmailAddress, StringLength(256)]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required, Compare(nameof(Password))]
        public string VerifyPassword { get; set; }
    }
}
