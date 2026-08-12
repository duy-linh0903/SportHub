using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Auth
{
    public class ResetPasswordRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Otp { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "M?t kh?u không kh?p")]
        public string VerifyPassword { get; set; } = string.Empty;
    }
}
