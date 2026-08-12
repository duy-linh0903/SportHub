using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.Auth
{
    public class ExternalLoginRequestDto
    {
        [Required]
        public string Provider { get; set; } // "Google" or "Facebook"

        [Required]
        public string IdToken { get; set; } // Token received from the provider
    }
}
