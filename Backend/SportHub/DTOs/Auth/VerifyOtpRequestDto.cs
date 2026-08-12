using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Auth
{
    public class VerifyOtpRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Otp { get; set; } = string.Empty;
    }
}
