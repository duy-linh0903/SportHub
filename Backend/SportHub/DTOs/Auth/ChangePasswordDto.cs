using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Auth
{
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
        [Required]
        public string VerifyPassword { get; set; }
    }
}
