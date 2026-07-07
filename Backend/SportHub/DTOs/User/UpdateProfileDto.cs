using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.User
{
    public class UpdateProfileDto
    {
        [StringLength(100)]
        public string Name { get; set; }
        [Phone, StringLength(20)]
        public string PhoneNumber { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
    }
}
