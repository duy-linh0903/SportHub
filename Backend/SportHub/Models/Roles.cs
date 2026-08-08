using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public class Roles
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string RoleName { get; set; }
        public Roles()
        {
            Id = Guid.NewGuid();
        }
    }
}
