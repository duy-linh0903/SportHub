using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.User
{
    public class UserResponseDto
    {
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
    }
}
