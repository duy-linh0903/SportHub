using SportHub.Models;
using System.ComponentModel.DataAnnotations;

namespace SportHub.DTOs.SportCenter
{
    public class SportCenterResponseDto
    {
        public Guid SportCenterId { get; set; }
        [Required, StringLength(100)]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SportCenterImages> images { get; set; }
        public double MinPrice { get; set; }
    }
}