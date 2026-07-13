using System.ComponentModel.DataAnnotations;

namespace SportHub.Models
{
    public class SportCenters
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt {  get; set; } = DateTime.Now;
    }
}
