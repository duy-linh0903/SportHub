using SportHub.DTOs.User;

namespace SportHub.DTOs.Auth
{
    public class LoginResponseDto
    {
        public string AccessToken { get; set; }
        public DateTime ExpiresAt { get; set; }
        public UserResponseDto User { get; set; } = new UserResponseDto();
    }
}
